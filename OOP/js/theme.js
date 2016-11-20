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
        "backgroundColor":"#ffffff"
    }
    Theme.prototype={
        setTheme:function () {
            this.css(this.options)
        }
    }
    function Plugin(option) {
        return this.each(function () {
            var $this   = $(this),
                data    = $this.data('bs.theme'),
                options = typeof option == 'object' && option
            if (!data) {
                $this.data('bs.theme', (data = new Theme(this, options)))
            }
        })
    }
    $.fn.theme             = Plugin;
    $.fn.theme.Constructor = Theme;
    $.fn.theme.noConflict = function () {
        return this
    }
}(jQuery)