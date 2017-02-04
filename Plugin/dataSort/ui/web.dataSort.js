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
        sortColumns:[]
    }
    DataTable.prototype={//为原型添加方法
        init:function(_relatedTarget){
            this.create(_relatedTarget);
        },
        destroy:function(){//销毁
        	this.$element.removeData("WEB.dataTable");
        },
        create:function(_relatedTarget){//生成icon
            var sortTh=this.$element.find("thead:first >tr > th"),_this=this;
            if(sortTh.length>0){
                sortTh.each(function(i,e){
                    var sortCol=_relatedTarget.sortColumns[i];
                    if(sortCol){
                        var sortable=sortCol.sort,//取排序属性
                            isPrimaryKey=sortCol.isPrimaryKey;//取是否是默认排序字段
                        if(sortable){
                            $(this).addClass('WEB_sort').append($('<div class="WEB_sortColumn"><span class="WEB_sortIcon WEB_sortAsc"></span><span class="WEB_sortIcon WEB_sortDesc"></span></div>'));  
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
            this.$element.on("click",".WEB_sort",function(i,e){
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
                sourceData=_relatedTarget.data;
            if(sortCol){
                var sortKey=sortCol.key;
                var sortedData=sourceData.sort(function(a,b){
                    var keyType=$.type(a[sortKey]);
                    if($.isNumeric(a[sortKey])){//处理数字
                        var aSortKey=a[sortKey],bSortKey=b[sortKey];
                    }else{//处理非数字
                        if(keyType==="string"){
                             var isDate=/\d{4}([-\/])\d{1,2}([-\/])\d{1,2}(\s{1}\d{1,2}:\d{1,2}(:\d{1,2})?)?/g;
                             if(isDate.test(a[sortKey])){//处理日期格式,转成时间戳
                                var aSortKey=Date.parse(a[sortKey].replace(/-/g,"/")),bSortKey=Date.parse(b[sortKey].replace(/-/g,"/"));
                             }else{//处理非日期格式
                                return isDesc?b[sortKey].localeCompare(a[sortKey]):a[sortKey].localeCompare(b[sortKey]);
                             }
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

            if ($.type(method) === 'string'){
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
