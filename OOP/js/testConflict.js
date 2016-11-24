/**
 * Created by Administrator on 2016/11/20.
 */

+function($){//用来测试冲突
    var old=$.fn.theme;
    $.fn.theme=function(){
        alert("自定义的插件")
    }
    $.fn.theme.noConflict = function () {
        $.fn.theme = old;
        return this;
    }
}(jQuery)