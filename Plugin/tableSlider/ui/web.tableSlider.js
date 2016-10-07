/**
 * Created by Administrator on 2015/8/9.
 */
;(function($,window,document,undefined){
    var defaults={//默认配置

    }
    var methods={
        init:function(options){
            return this.each(function(){
                var settings=$(this).data("WEB_tableSlider_settings");//用户配置
                if(settings){
                    this.settings=$.extend(true,{},settings,options);
                }else{
                    this.settings=$.extend(true,{},defaults,options);
                    $(this).data("WEB_tableSlider_settings",this.settings);
                }
                methods._createSlider.call(this);//创建滑动按钮
            })
        },
        _createSlider:function () {//创建结构
            var _this=this,$this=$(this),cw=$(this).outerWidth(true),tc=$(this).parents(".WEB_tableSlider");
            if(tc.length==0){
                $(this).wrap('<div class="WEB_tableSlider_container"><div class="WEB_tableSlider"></div></div>');
            }
            var container=$(this).parents(".WEB_tableSlider_container"),
                prevBtn=$('<div class="WEB_tableSlider_button WEB_tableSlider_prev"></div>'),
                nextBtn=$('<div class="WEB_tableSlider_button WEB_tableSlider_next"></div>');
            container.find(".WEB_tableSlider_button").remove();
            container.append(prevBtn,nextBtn);
        }
    }
    $.fn.WEB_tableSlider=function(){
        var ieVersion=navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion .split(";")[1].replace(/[ ]/g,"");
        if(ieVersion=="MSIE7.0" || ieVersion=="MSIE6.0"|| ieVersion=="MSIE5.0"){
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
    }
})(jQuery,window,document);
