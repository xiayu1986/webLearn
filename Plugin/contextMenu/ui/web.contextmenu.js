/**
 * Created by Administrator on 2015/8/9.
 */
;(function($,window,document,undefined){
	var ContextMenu=function(element,options){
	 	this.$element=$(element);
        this.options=options;
	}
	ContextMenu.VERSION="1.0.0";
    ContextMenu.DEFAULTS={
       	offsetY:10,
		menu:[{"text":"删除","method":function(){}},{"text":"新增","method":function(){}},{"text":"复制","method":function(){}}]
    }
    ContextMenu.prototype={//为原型添加方法
        init:function(_relatedTarget){
        	var _this=this;
            this.$element.off("contextmenu").on("contextmenu",function(e){
				e.preventDefault();//阻止默认事件
				var selectDom=$(e.currentTarget);
				/*if($.type(_this.options.menu)!=="array" || $.isEmptyObject(_this.options.menu)){
					return;
				}*/
				var contextContainer=$("#WEB_contextMenu");
				contextContainer.remove();
				contextContainer=$('<ul id="WEB_contextMenu" class="WEB_contextMenu"></ul>');
				var menuData=_this.options.menu;
				$.each(menuData,function(key,data){
					var eachItem=$('<li class="WEB_contextMenu_item">'+(data.text||'请配置节点名称')+'</li>');
					eachItem.off("click").on("click",function(e){
						data.method(_this,_relatedTarget);
					})
					contextContainer.append(eachItem);
				});
				contextContainer.appendTo($("body")).css({"left":e.clientX,"top":e.clientY+_this.options.offsetY});
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

    function Plugin(option,_relatedTarget) {
        return this.each(function () {
            var $this   = $(this),
                data    = $this.data('WEB.contextMenu'),
                options = $.extend({}, ContextMenu.DEFAULTS, $this.data(),  $.type(option) === 'object' && option);
            if (!data) {
                $this.data('WEB.contextMenu', (data = new ContextMenu(this, options)));
            }
            if ($.type(option) === 'string'){
                data[option](_relatedTarget);
            } else if(options.init){//执行初始化方法
                data.init(_relatedTarget);
            }         
        })
    }
    var old=$.fn.WEB_contextMenu;
    $.fn.WEB_contextMenu             = Plugin;
    $.fn.WEB_contextMenu.Constructor = ContextMenu;
    $.fn.WEB_contextMenu.noConflict = function () {
        $.fn.WEB_contextMenu=old;
        return this
    }
})(jQuery,window,document);
