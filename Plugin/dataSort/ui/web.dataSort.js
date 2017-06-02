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
    DataTable.VERSION="1.0.2";
    DataTable.DEFAULTS={
        isFilter:true,
        data:[],
        sortColumns:[],
        filterColumns:[],
        beforeSort:$.noop(),
        afterSort:$.noop,
        ignoreKey:[],
        filterContainer:$("body"),
        emptyFilter:function () {
            
        }
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
            this._filterSource(_relatedTarget);
            this._filterColumns(_relatedTarget);
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
                        aSortKey=eval('a.'+sortKey);
                        bSortKey=eval('b.'+sortKey);
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
        _filterSource:function(_relatedTarget){//全局筛选
            if(!_relatedTarget.isFilter){
                return;
            }
            var f=$("#WEB_dataTable_filter"),
                _this=this,
                source=_relatedTarget.data;
            if(f.length===0){
                _relatedTarget.filterContainer.append('<input type="txt" class="WEB_dataTable_filter" id="WEB_dataTable_filter" />');
                f=$("#WEB_dataTable_filter");
            }
            f.off("input").on("input",function(){
                var w=$(this).val();
                _relatedTarget.source=null;
                var fList=recursion(source,w),
                    result=toJSON(fList);
                if($.isEmptyObject(result)){
                    _relatedTarget.emptyFilter.call(_this);
                    return;
                }
                var isDesc=$(".WEB_activeSort").hasClass('WEB_sortByDesc');//是否是降序
                _relatedTarget.source=result;
                _this.sort(_relatedTarget,isDesc);

            })
            function recursion(data,w){
                var res=[];
                $.each(data,function(i,d){
                    if(!d){
                        return;
                    }
                    var matchCount=0,
                        dataStr=JSON.stringify(d),
                        words=w.split(" ");
                    $.each(words,function(n,k){
                        var rule=new RegExp(k,'gi');
                        if(rule.test(dataStr)){
                            matchCount++;
                        }
                    })
                    if(matchCount===words.length && dataStr && $.inArray(dataStr,res)===-1){
                        res.push(dataStr);
                    }
                })
                return res;
            }

            function toJSON(list){//将字符串转换成JSON
                var res=[];
                $.each(list,function(n,str){
                    res.push($.parseJSON(str));
                })
                return res;
            }
        },
        _filterColumns:function(_relatedTarget){//按列筛选
            var _this=this,
                filterColumnsData=_relatedTarget.filterColumns,
                isFilterByColumns=this._affirmFilterByColumns(filterColumnsData),
                source=_relatedTarget.data;
            if(!isFilterByColumns){
                return;
            }
            this.$element.find("thead:first tr.WEB_dataTable_filterColumns").remove();
            var filterInput=[];
            $.each(filterColumnsData,function(key,data){
                var isFilter=data.filter,
                    inputHtml=isFilter?'<input type="text" class="WEB_dataTable_filterKey" />':'<input type="text" class="WEB_dataTable_filterKey WEB_dataTable_filterDisabled" disabled />',
                    filterInputHtml='<th>'+inputHtml+'</th>';
                   filterInput.push(filterInputHtml);
            })
            filterInput.unshift('<tr class="WEB_dataTable_filterColumns">');
            filterInput.push('</tr>');
            var filterColumnsTr=filterInput.join("");
            this.$element.find("thead:first").append(filterColumnsTr);
            filterColumnsTr=this.$element.find("thead:first tr.WEB_dataTable_filterColumns");
            
            filterColumnsTr.off("input").on("input",".WEB_dataTable_filterKey",function(e){
                var w=$(this).val(),
                    keyInd=$(this).parent().index();
                _relatedTarget.source=null;
                var fList=recursion(source,w,keyInd);
                if($.isEmptyObject(fList)){
                    _relatedTarget.emptyFilter.call(_this);
                    return;
                }
                var isDesc=$(".WEB_activeSort").hasClass('WEB_sortByDesc');//是否是降序
                _relatedTarget.source=fList;
                _this.sort(_relatedTarget,isDesc);

            })
            function recursion(data,w,keyInd){
                var res=[],
                    filterKey=_relatedTarget.filterColumns[keyInd].key;
                    console.log(filterKey)
                $.each(data,function(i,d){
                    if(!d){
                        return;
                    }
                    var matchCount=0,
                        targetData=eval('d.'+filterKey),
                        dataStr=JSON.stringify(targetData),
                        words=w.split(" ");
                    $.each(words,function(n,k){
                        var rule=new RegExp(k,'gi');
                        if(rule.test(dataStr)){
                            matchCount++;
                        }
                    })
                    if(matchCount===words.length && dataStr && $.inArray(dataStr,res)===-1){
                        res.push(d);
                    }
                })
                return res;
            }
        },
        _affirmFilterByColumns:function(filterData){//确认是否按列排序
            var result=false;
            $.each(filterData,function(i,d){
                if(d.filter){
                    result=true;
                    return false;
                }
            })
            return result;
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
