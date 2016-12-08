/**
 * Created by Administrator on 2016/11/20.
 */

+function ($) {
    var Theme=function (element,options) {
        this.$element=$(element);
        this.options=$.extend(true,{},Theme.DEFAULTS,options);
    }
    Theme.VERSION="1.0.0";
    Theme.DEFAULTS={
        "backgroundColor":"#000000",
        init: true
    }
    Theme.prototype={
        set:function (_relatedTarget) {
            this.$element.css(_relatedTarget||this.options)
        },
        init:function(_relatedTarget){
            this.set(_relatedTarget)
        }
    }
    function Plugin(option,_relatedTarget) {
        return this.each(function () {
            var $this   = $(this),
                data    = $this.data('bs.theme'),
                options = $.extend({}, Theme.DEFAULTS, $this.data(), typeof option == 'object' && option);
            if (!data) {
                $this.data('bs.theme', (data = new Theme(this, options)))
            }
            if ($.type(option) === 'string'){
                data[option](_relatedTarget)
            } else if(options.init){//执行初始化方法
                data.init(_relatedTarget)
            }         
        })
    }
    var old=$.fn.theme;

    $.fn.theme             = Plugin;
    $.fn.theme.Constructor = Theme;
    $.fn.theme.noConflict = function () {
        $.fn.theme=old;
        return this
    }
}(jQuery)