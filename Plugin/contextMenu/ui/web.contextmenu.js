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

	var ContextMenu=function(element,options){
	 	this.$element=$(element);
        this.options=options;
	}
	ContextMenu.VERSION="1.0.0";
    ContextMenu.DEFAULTS={
       	disY:10,
		menu:[{"text":"删除","method":function(){}},
		{"text":"新增","method":function(){}},
		{"text":"复制","method":function(){}}]
    }
    ContextMenu.prototype={//为原型添加方法
        init:function(_relatedTarget){
        	var _this=this;
            this.$element.off("contextmenu").on("contextmenu",function(e){
				e.preventDefault();//阻止默认事件
				if($.type(_relatedTarget.menu)!=="array" || $.isEmptyObject(_relatedTarget.menu)){
					$.error("参数格式错误,menu的类型必须是数组，请检查！")
					return;
				}
				var contextContainer=$("#WEB_contextMenu");
				contextContainer.remove();
				contextContainer=$('<ul id="WEB_contextMenu" class="WEB_contextMenu"></ul>');
				var menuData=_relatedTarget.menu;
				$.each(menuData,function(key,data){
					var eachItem=$('<li class="WEB_contextMenu_item">'+(data.text||'请配置节点名称')+'</li>');
					eachItem.off("click").on("click",function(e){
						data.method(_this,_relatedTarget);
                        var event = $.Event('WEB.contextMenu.destroy')
                        _this.$element.trigger(event);
					})
					contextContainer.append(eachItem);
				});
				contextContainer.appendTo($("body")).css({"left":e.clientX,"top":e.clientY+_relatedTarget.disY});
				var e = $.Event('WEB.contextMenu.create', { relatedTarget: _relatedTarget })
    			_this.$element.trigger(e);
			})
			$(document).on("click",function(){
				_this.destroy();
			})
        },
        destroy:function(){//销毁
        	this.$element.removeData("WEB.contextMenu");
        	$("#WEB_contextMenu").remove();
        }
    }

    function Plugin(method,option) {
    	var len=arguments.length,settings=arguments[1];
    	if(len===1){
    		settings=$.type(arguments[0])==="object"?arguments[0]:{}
    	}
        return this.each(function () {
            var $this   = $(this),
                data    = $this.data('WEB.contextMenu'),
                options = $.extend({}, ContextMenu.DEFAULTS, $this.data(),settings);
            if (!data) {
                $this.data('WEB.contextMenu', (data = new ContextMenu(this, options)));
            }

            if ($.type(method) === 'string'){
                data[method]?data[method](options):$.error("不支持的方法！");
            } else{//执行初始化方法
                data.init(options);
            }        
        })
    }
    var old=$.fn.WEB_contextMenu;
    if(!$.isBrowerSupportWebPlugin()){
        return;
    }
    $.fn.WEB_contextMenu             = Plugin;
    $.fn.WEB_contextMenu.Constructor = ContextMenu;
    $.fn.WEB_contextMenu.noConflict = function () {
        $.fn.WEB_contextMenu=old;
        return this
    }
})(jQuery,window,document);
