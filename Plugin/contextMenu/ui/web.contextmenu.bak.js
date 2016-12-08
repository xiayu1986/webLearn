/**
 * Created by Administrator on 2015/8/9.
 */
;(function($,window,document,undefined){
	var defaults={//默认配置
		offsetY:10,
		menu:[{"text":"删除","method":function(){}},{"text":"新增","method":function(){}},{"text":"复制","method":function(){}}]
	};
	var methods={
		init:function(options){//初始化
			return this.each(function(){
				var settings=$(this).data("WEB_context_settings");//用户配置
				if(settings){
					this.settings=$.extend(true,{},settings,options);
				}else{
					this.settings=$.extend(true,{},defaults,options);
					$(this).data("WEB_context_settings",this.settings);
				}
				methods._createMenu.call(this);//创建容器
			});
		},
		_createMenu:function(){
			$(this).off("contextmenu").on("contextmenu",function(e){
				e.preventDefault();//阻止默认事件
				var selectDom=$(e.currentTarget);
				var _this=this;
				if($.type(this.settings.menu)!=="array" || $.isEmptyObject(this.settings.menu)){
					return;
				}
				var contextContainer=$("#WEB_contextMenu");
				contextContainer.remove();
				contextContainer=$('<ul id="WEB_contextMenu" class="WEB_contextMenu"></ul>');
				var menuData=this.settings.menu;
				$.each(menuData,function(key,data){
					var eachItem=$('<li class="WEB_contextMenu_item">'+(data.text||'请配置节点名称')+'</li>');
					eachItem.off("click").on("click",function(e){
						data.method(_this);
					})
					contextContainer.append(eachItem);
				});
				contextContainer.appendTo($("body")).css({"left":e.clientX,"top":e.clientY+this.settings.offsetY});
			})
		}
	};
    $.fn.WEB_contextMenu=function(){
		var ieVersion=navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion .split(";")[1].replace(/[ ]/g,"");
		if(ieVersion=="MSIE8.0" || ieVersion=="MSIE7.0" || ieVersion=="MSIE6.0"|| ieVersion=="MSIE5.0"){
			alert("您的浏览器版本过低，本插件无法提供支持，请升级！");
			return;
		}
		var method=arguments[0],ARG;
		if(methods[method] && method.charAt(0)!="_"){
		    method=methods[method];
		    ARG=Array.prototype.slice.call(arguments,1);
		}else if(typeof method ==="object" || !method){
		    method=methods.init;
		    ARG=arguments;
		}else{
		    $.error("方法未正确调用");
		    return this;
		}
		return method.apply(this,ARG);
	};
})(jQuery,window,document);
