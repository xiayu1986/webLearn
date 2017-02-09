/**
 * Created by Administrator on 2015/8/9.
 */
;(function($,window,document,undefined){
    $.extend({//增加对低版本IE浏览器的校验
        isBrowerSupportWebPlugin:function(){
            var result=false,ieVersion=navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion .split(";")[1].replace(/[ ]/g,""),
                matchArray=["MSIE8.0","MSIE7.0","MSIE6.0","MSIE5.0"];
                $.each(matchArray,function(i,k){
                    if(ieVersion==k){
                        alert("您的浏览器版本过低，本插件无法提供支持，请升级！");
                        result=false;
                        return false;
                    }
                    result=true;
                })
            return result;
        }
    });

    var DataTable=function(element,options){
        this.$element=$(element);
        this.options=options;
    }
    DataTable.VERSION="1.0.0";
    DataTable.DEFAULTS={
        isFilter:true,
        data:[],
        sortColumns:[],
        beforeSort:$.noop(),
        afterSort:$.noop,
        ignoreKey:[],
        filterContainer:$("body")
    }
    DataTable.prototype={//为原型添加方法
        init:function(_relatedTarget){
            if($.type(_relatedTarget.data)!="array"){
                alert("数据源必须为数组！");
                return;
            }
            if(_relatedTarget.data.length==0){
                alert("数据源不能为空！");
                return;
            }
            this.create(_relatedTarget);
            this._filter(_relatedTarget);
        },
        destroy:function(){//销毁
            this.$element.find("thead:first >tr > th").removeClass("WEB_sortByDesc WEB_sortByAsc WEB_activeSort WEB_sort");
            this.$element.removeData("WEB.dataTable");
        },
        create:function(_relatedTarget){//生成icon
            if(_relatedTarget.data.length==1){
                _relatedTarget.afterSort.call(this,{ relatedTarget: _relatedTarget,sortedData:_relatedTarget.data});
                return;
            }
            var sortTh=this.$element.find("thead:first >tr > th"),_this=this;
            if(sortTh.length>0){
                sortTh.each(function(i,e){
                    var sortCol=_relatedTarget.sortColumns[i];
                    if(sortCol){
                        var sortable=sortCol.sort,//取排序属性
                            isPrimaryKey=sortCol.isPrimaryKey;//取是否是默认排序字段
                        if(sortable){
                            $(this).addClass('WEB_sort');
                        }
                        if(isPrimaryKey){
                            _this.clear();
                            $(this).addClass("WEB_sortBy"+sortCol.type).addClass('WEB_activeSort');
                            var isDesc=$(this).hasClass('WEB_sortByDesc');//是否是降序
                            _this.sort(_relatedTarget,isDesc);
                        }
                    }
                })
            }
            this.event(_relatedTarget);
        },
        event:function(_relatedTarget){//绑定点击事件
            var _this=this;
            this.$element.off("click").on("click",".WEB_sort",function(){
                _relatedTarget.beforeSort.call(_this,{ relatedTarget: _relatedTarget});
                _this.switch($(this),_relatedTarget);
            })
        },
        clear:function(){//清除排序样式
            $(".WEB_sort").removeClass('WEB_sortByDesc WEB_sortByAsc WEB_activeSort');
        },
        sort:function(_relatedTarget,isDesc){//排序
            var i=$(".WEB_activeSort").index()||0,
                _this=this,
                sortCol=_relatedTarget.sortColumns[i],
                sourceData=_relatedTarget.source?_relatedTarget.source:_relatedTarget.data;
            if(sortCol){
                var sortKey=sortCol.key;
                var sortedData=sourceData.sort(function(a,b){
                    var aSortKey,bSortKey,keyType;
                    if($.type(sortKey)==="object"){
                        if(sortKey.type==="array"){
                            aSortKey=a[sortKey.objKey][sortKey.index][sortKey.orderKey];
                            bSortKey=b[sortKey.objKey][sortKey.index][sortKey.orderKey];
                        }
                    }else{
                       aSortKey=a[sortKey];
                       bSortKey=b[sortKey];
                    }
                    aSortKey=$.trim(aSortKey);
                    bSortKey=$.trim(bSortKey);
                    keyType=$.type(aSortKey);
                    if(!$.isNumeric(aSortKey) && keyType==="string"){//处理非数字
                        var isDate=/\d{4}([-\/])\d{1,2}([-\/])\d{1,2}(\s{1}\d{1,2}:\d{1,2}(:\d{1,2})?)?/g;
                        if(isDate.test(aSortKey)){//处理日期格式,转成时间戳
                            aSortKey=Date.parse(aSortKey.replace(/-/g,"/"));
                            bSortKey=Date.parse(bSortKey.replace(/-/g,"/"));
                        }else{//处理非日期格式
                            return isDesc?bSortKey.localeCompare(aSortKey):aSortKey.localeCompare(bSortKey);
                        }
                    }
                    return isDesc?(bSortKey-aSortKey):(aSortKey-bSortKey);
                })
                _relatedTarget.afterSort.call(_this,{ relatedTarget: _relatedTarget,sortedData:sortedData});
            }
        },
        switch:function(obj,_relatedTarget){//切换排序样式
            var isDesc=obj.hasClass('WEB_sortByDesc');//是否是降序
            this.clear();
            obj.addClass('WEB_activeSort');
            isDesc?obj.removeClass('WEB_sortByDesc').addClass('WEB_sortByAsc'):obj.removeClass('WEB_sortByAsc').addClass('WEB_sortByDesc');
            isDesc=!isDesc;
            this.sort(_relatedTarget,isDesc);
        },
        _filter:function(_relatedTarget){
            if(!_relatedTarget.isFilter){
                return;
            }
            var f=$("#WEB_dataTable_filter"),
                fList=[],
                _this=this;
                source=_relatedTarget.data;
            if(f.length===0){
                _relatedTarget.filterContainer.append('<input type="txt" class="WEB_dataTable_filter" id="WEB_dataTable_filter" />');
                f=$("#WEB_dataTable_filter");
            }
            f.off("input").on("input",function(e){
                var w=$(this).val(),
                rule=new RegExp(w,'gi');
                fList=[];
                _relatedTarget.source=null;
                recursion(source,rule,0);
                var result=toJSON(fList);
                var isDesc=$(".WEB_activeSort").hasClass('WEB_sortByDesc');//是否是降序
                _relatedTarget.source=result;
                _this.sort(_relatedTarget,isDesc);
            })
            function recursion(data,rule,count){
                count++;
                $.each(data,function(i,d){
                    if($.inArray(i,_relatedTarget.ignoreKey)>-1){//跳过忽略的键
                        return;
                    }
                    if(typeof d ==="object"){
                        recursion(d,rule,count);//递归处理
                    }else{
                        if(rule.test(d)){
                            if(count==2){//将第二级数据添加到结果集中
                                var dataStr=JSON.stringify(data);
                                if($.inArray(dataStr,fList)===-1){
                                    fList.push(dataStr);
                                }
                            }
                        }
                    }
                })
            }

            function toJSON(list){//将字符串转换成JSON
                var res=[];
                $.each(list,function(n,str){
                    res.push($.parseJSON(str));
                })
                return res;
            }
        }
    }

    function Plugin(method,option) {
        var len=arguments.length,settings=arguments[1];
        if(len===1){
            settings=$.type(arguments[0])==="object"?arguments[0]:{}
        }
        return this.each(function () {
            var $this   = $(this),
                data    = $this.data('WEB.dataTable'),
                options = $.extend({}, DataTable.DEFAULTS, $this.data(),settings);
            if (!data) {
                $this.data('WEB.dataTable', (data = new DataTable(this, options)));
            }

            if ($.type(method) === 'string' && method.charAt(0)!="_"){
                data[method]?data[method](options):$.error("不支持的方法！");
            } else{//执行初始化方法
                data.init(options);
            }        
        })
    }
    var old=$.fn.WEB_dataTable;
    if(!$.isBrowerSupportWebPlugin()){
        return;
    }
    $.fn.WEB_dataTable             = Plugin;
    $.fn.WEB_dataTable.Constructor = DataTable;
    $.fn.WEB_dataTable.noConflict = function () {
        $.fn.WEB_dataTable=old;
        return this
    }
})(jQuery,window,document);
