/**
 * Created by Administrator on 2015/8/9.
 */
;(function($,window,document,undefined){
    var defaults={//默认配置
        modal:{ showModal:true,modalOpacity:0.5,modalColor:"#000",modalClass:9,modalClose:true},//半透明层配置
        ESClose:true,//是否按ESC键关闭
        lockScrollbar:false,//是否锁定浏览器滚动条
        title:{showTitle:true,titleInner:"标题"},//标题配置
        close:{showClose:true,closeInner:"×",auto:false,delay:2000},//关闭按钮配置
        buttons:{showButton:true,panel:[]},//按钮配置
        draggable:false,//是否可拖拽
        scrollerRate:5,//滚动速度 
        beforeOpen:function(){},//弹出层打开前执行的方法
        afterOpen:function(){},//弹出层打开后执行的方法
        afterClose:function(){},//弹出层关闭后执行的方法
        beforeClose:function(){},//弹出层关闭前执行的方法
        dragIng:function(){},//拖拽过程中过执行的方法
        dragStart:function(){},//拖拽开始执行的方法
        dragEnd:function(){}//拖拽结束执行的方法
    }
    var methods={
        init:function(options,e){
            return this.each(function(){
                var settings=$(this).data("WEB_dialog_settings");//用户配置
                this.Event=e||{};
                if(settings){
                    this.settings=$.extend(true,{},settings,options);
                }else{
                    this.settings=$.extend(true,{},defaults,options);
                    $(this).data("WEB_dialog_settings",this.settings);
                }
                methods._createDialog.call(this);//弹出层
            })
        },
        position:function(){//公共方法 设置弹出层居中
            return this.each(function(){
                methods._dialogCenter.call(this);//弹出居中
            })
        },
        _dialogCenter:function(){//设置弹出层居中
            var minW=parseInt($(this).find(".WEB_dialog_title").css("minWidth")),//最小宽度
                view=$(window).width(),//当前视口宽度
                borderW=parseInt($(this).css("borderLeftWidth"))||0,//弹出层边框宽度
                padW=parseInt($(this).css("paddingLeft"))||0,//弹出层内边距宽度
                curWidth=minW;//存储当前宽度
            $(this).css({"marginLeft":0,"marginTop":0,"width":minW,"height":"auto","left":"50%","top":"50%","position":"fixed"});//重置弹出层样式
            if(this.settings.width!=undefined && $.isNumeric(Number(this.settings.width)) && Number(this.settings.width)>0){//用于支持数字
                curWidth=this.settings.width;
            }else if("string"==typeof this.settings.width){//用于支持百分比
                var rule=/^(1[0-9]?|[2-9]\d?)%$/gi;
                if(rule.test(this.settings.width)){
                    var wRate=this.settings.width.replace(rule,"$1");
                    wRate=wRate/100;
                    curWidth=view*wRate;
                    if(!$.isNumeric(curWidth)){
                        curWidth=minW;
                    }
                }
            }
            if(curWidth>=view){//确定当前弹出层的宽度
                curWidth=view-2*borderW-2*padW;
            }else if(curWidth<minW){
                curWidth=minW
            }
            $(this).css({"width":curWidth});//设置当前弹出层的宽度
            if(this.settings.height!=undefined && this.settings.height>0){
                $(this).css({"height":this.settings.height});
            }
            var ml=$(this).outerWidth(),mt=$(this).outerHeight();
            if(ml>=view){
                $(this).css({"marginLeft":0,"left":0});
            }else{
                $(this).css({"marginLeft":-ml/2});
            }
            if(mt>$(window).height()){
                $(this).css({"height":$(window).height()-2*padW-2*borderW,"marginTop":0,"top":0,"overflow":"hidden"});
                methods._createScrollBar.call(this);
                /*var DT=$(document).scrollTop();
                $(this).css({"marginTop":0,"top":DT,"position":"absolute"});
                var h=$(this).outerHeight();
                if(mt<$(document).height()){
                    h=$(document).height();
                }
                $("html").css({"overflow-y":"auto"});*/
            }else{
                $(this).css({"marginTop":-mt/2,"top":"50%","position":"fixed"});
            }
            $("html").css({"overflow-x":"hidden"});//用于消除横向滚动条
            if(this.settings.draggable){//调用拖拽
                methods._dragDialog.call(this);
            }
        },
        _createDialog:function(){//生成弹出层
             var _this=this;
            if(this.settings.beforeOpen && $.isFunction(this.settings.beforeOpen)){
                this.settings.beforeOpen(this.Event)
            }
           /* this.e = $.Event('webDialog.beforeOpen');
           	$(this).trigger(this.e);*/
            $(this).css({"display":"block"});
            methods._createDialogCell.call(this);//为内层包裹的元素添加特定class名
            methods._createButton.call(this);//调用创建按钮
            methods._createModal.call(this);//调用创建遮罩层方法
            if(this.settings.lockScrollbar){
                methods._lockScrollbar.call(this);//调用锁定浏览器滚动条方法
            }
            methods._dialogCenter.call(this);//调用位置居中方法
            if(this.settings.close.auto){
                if(this.timer){
                    clearTimeout(this.timer);
                }
                this.timer=setTimeout(function(){
                    methods._closeDialog.call(_this);//自动关闭
                },this.settings.close.delay)

            }
            if(this.settings.afterOpen && $.isFunction(this.settings.afterOpen)){
                this.settings.afterOpen(this.Event)
            }
            methods._resetModal.call(_this);//重置遮罩层
            $(document).on("keydown",function(e){
                if(e.keyCode==27){
                	if(!_this.settings.ESClose){
                		return;
                	}
                    if(_this.settings.close.auto && _this.timer){
                        clearTimeout(_this.timer);
                    }
                    methods._closeDialog.call(_this);
                }
            });
            if(this.settings.draggable){
                $(this).find(".WEB_dialog_title").css({"cursor":"move"});
            }else{
                $(this).find(".WEB_dialog_title").css({"cursor":"auto"});
            }
        },
        _createButton:function(){//生成按钮及按钮事件
            var _this=this;
            $(this).find(".WEB_dialog_title,.WEB_dialog_close,.WEB_dialog_panel").remove();
            if(this.settings.draggable){//如果配置了拖拽则必须创建标题
                methods._createDialogTitle.call(this);
            }else{
                if(this.settings.title.showTitle){//创建标题
                    methods._createDialogTitle.call(this);
                }
            }
            if(this.settings.close.showClose){//创建关闭按钮
                var closeInner=this.settings.close.closeInner;
                var closeBtn=$('<div class="WEB_dialog_close">'+closeInner+'</div>');
                closeBtn.on("click",function(){
                    if(_this.settings.close.auto){
                        clearTimeout(_this.timer);
                    }
                    methods._closeDialog.call(_this);

                })
                if(closeInner && closeInner!=""){
                    closeBtn.css("backgroundImage","");
                }
                closeBtn.prependTo($(this));

            }
            if(this.settings.buttons.showButton){//创建右下角按钮
                var btnPanel=$('<div class="WEB_dialog_panel"></div>');
                btnPanel.css({"marginRight":0,"marginLeft":0,"paddingRight":0,"paddingLeft":0});
                $.each(this.settings.buttons.panel,function(ind,data){
                    if(data.userClass!=undefined && data.userClass!=""){
                        var eachBtn=$('<div class="WEB_dialog_button '+data.userClass+'"><span class="dialog_button">'+data.btnText+'</span></div>');
                    }else{
                        var eachBtn=$('<div class="WEB_dialog_button"><span class="dialog_button">'+data.btnText+'</span></div>');
                    }
                    eachBtn.on("click",function(e){
                        if(data.btnFn && $.isFunction(data.btnFn)){
                            data.btnFn(e);
                        }
                        clearTimeout(_this.timer);
                        if(data.close || data.close==undefined){
                            methods._closeDialog.call(_this);
                        }else if($.isNumeric(data.close)){
                            _this.timer=setTimeout(function(){
                                methods._closeDialog.call(_this);
                            },data.close)
                        }

                    });
                    eachBtn.appendTo(btnPanel);

                })

                btnPanel.appendTo(this);

            }
        },
        _closeDialog:function(){//关闭
            if(this.settings.beforeClose && $.isFunction(this.settings.beforeClose)){
                this.settings.beforeClose(this.Event)
            }
            $(this).css({"display":"none"});
            $("#ui-modal").remove();
            if(this.settings.lockScrollbar){
                methods._unLockScrollbar.call(this);//调用解除锁定浏览器滚动条方法
            }
            if(this.settings.afterClose && $.isFunction(this.settings.afterClose)){
                this.settings.afterClose(this.Event);
            }

        },
        close:function(){//关闭弹出层
           return this.each(function(){
                methods._closeDialog.call(this);//关闭弹出层
            })
        },
        _createModal:function(){//创建遮罩层
            var _this=this;
            $("#ui-modal").remove();
            if(this.settings.modal.showModal){
                $("#ui-modal").remove();
                var modal=$('<div id="ui-modal"></div>');
                modal.css({"width":$(window).width(),
                    "height":$(document).height(),
                    "background":this.settings.modal.modalColor,
                    "position":"absolute",
                    "left":0,
                    "top":0,
                    "opacity":this.settings.modal.modalOpacity,
                    "zIndex":this.settings.modal.modalClass
                })
                if(this.settings.modal.modalClose){
                    modal.on("click",function(){
                        if(_this.settings.close.auto){
                            clearTimeout(_this.timer);
                        }
                        methods._closeDialog.call(_this);
                    })
                }
                modal.appendTo($("body"));

            }
        },
        _resetModal:function(){//重置遮罩层大小
            var _this=this;
            $(window).on("resize",function(){
                methods._createScrollBar.call(_this);//重置弹出层高度
                if($("#ui-modal").length==1){
                    $("#ui-modal").css({"width":$(window).width(),"height":$(document).height()})
                }
                if(!_this.settings.draggable){
                    methods._dialogCenter.call(_this);
                }

            }).on("scroll",function () {
                if($("#ui-modal").length==1){
                    $("#ui-modal").css({"width":$(window).width(),"height":$(document).height()})
                }
            })
        },
        _lockScrollbar:function(){//禁止滚动
            console.log("禁用")
            $("html").css({"overflow":"hidden"});
            if($("#ui-modal").length==1){
                $("#ui-modal").css({"width":$(window).width()})
            }
        },
        _unLockScrollbar:function(){//恢复滚动
            $("html").css({"overflow":"auto","height":"auto"});
        },
        _dragDialog:function () {
            if(!this.settings.draggable){
                return;
            }
            var $this=$(this),T=$(this).offset().top,L=$(this).offset().left,_this=this,dragPanel=$(this).find(".WEB_dialog_title");
            $(this).css({"marginTop":0,"marginLeft":0,"position":"absolute","top":T,"left":L});
            var MaxY=$(window).height()-$(this).outerHeight(true),MaxX=$(window).width()-$(this).outerWidth(true);
           this.dragging = false;
            var iY,iX;
            dragPanel.mousedown(function(e) {
                if(!_this.settings.draggable){
                    return;
                }
                if(_this.settings.dragStart && $.isFunction(_this.settings.dragStart)){
                    _this.settings.dragStart(_this.Event)
                }
                _this.dragging = true;
                iY = e.clientY - $(this).parent().position().top;
                iX = e.clientX - $(this).parent().position().left;
                dragPanel.setCapture && dragPanel.setCapture();
                return false;
            })
            $(document).mousemove(function(e) {
                if(!_this.settings.draggable){
                    return;
                }
                if (_this.dragging) {
                    if(_this.settings.dragIng && $.isFunction(_this.settings.dragIng)){
                        _this.settings.dragIng(_this.Event)
                    }
                    var oY = e.clientY - iY;
                    var oX = e.clientX - iX;
                    if(oY<0){
                        oY=0
                    }else if(oY>=MaxY){
                        oY=MaxY
                    }
                    if(oX<0){
                        oX=0
                    }else if(oX>=MaxX){
                        oX=MaxX
                    }
                    if(MaxY<0){
                        oY=0;
                    }
                    $this.css({"top":oY,"left":oX});
                    return false;
                }
            })
            $(document).mouseup(function(e) {
                if(!_this.settings.draggable){
                    return;
                }
                if(_this.settings.dragEnd && $.isFunction(_this.settings.dragEnd)){
                    _this.settings.dragEnd(_this.Event)
                }
                _this.dragging = false;
                dragPanel.releaseCapture && dragPanel.releaseCapture();
                e.cancelBubble = true;
            })
        },
        _createDialogTitle:function () {
            var titleInner=this.settings.title.titleInner||"请配置标题",
                titleBar=$('<div class="WEB_dialog_title"><div class="title">'+titleInner+'</div></div>');
            titleBar.css({"marginRight":0,"marginLeft":0,"paddingRight":0,"paddingLeft":0});
            titleBar.prependTo($(this));
        },
        _createScrollBar:function(){//创建滚动条
            var clientH=viewHeight=$(window).height(),//获取当前可视区高度
                borderW=parseInt($(this).css("borderLeftWidth"))||0,//弹出层边框宽度
                padW=parseInt($(this).css("paddingLeft"))||0,//弹出层内边距宽度
                dialogCell=$(this).find(".WEB_dialog_cell"),scrollContainer=$(this).find(".WEB_dialog_scroll_container");//查找内层元素
            if(scrollContainer.length==0){
              dialogCell.wrap('<div class="WEB_dialog_scroll_container"></div>');//将内层元素包裹起来  
            }
            var scrollContainer=$(this).find(".WEB_dialog_scroll_container"),//重新获取包裹元素以便追加滚动条
            titlePanel=$(this).find(".WEB_dialog_title"),//获取弹出层标题
            closeDom=$(this).find(".WEB_dialog_close"),//获取弹出层关闭按钮
            btnPanel=$(this).find(".WEB_dialog_panel");//获取弹出层按钮组
            viewHeight=viewHeight-borderW*2||0;
            viewHeight=viewHeight-padW*2||0;
            viewHeight=viewHeight-titlePanel.height()||0;
            viewHeight=viewHeight-btnPanel.height()||0;//设置弹出层内可滚动区高度
            clientH=viewHeight;
            scrollContainer.css({"height":clientH});
            dialogCell.css({"position":"relative","left":0,"top":0});
            $(this).find(".WEB_dialog_scroll_bar").remove();
            var minScrollHeight=parseInt(scrollContainer.css("minHeight"));
            if(clientH<=minScrollHeight){
                clientH=minScrollHeight;
            }
            var dialogScrollBar=$('<div class="WEB_dialog_scroll_bar"><div class="WEB_dialog_scroll_slider"></div></div>');//创建滚动条
            scrollContainer.append(dialogScrollBar);
            var scroller=$(this).find(".WEB_dialog_scroll_bar"),
            SH=scroller.height(),ST=(clientH-SH)/2;
            scroller.css({"top":ST});
            methods._createScroller.call(this);
        },
        _createScroller:function(){//为滚动条添加事件
            var _this=this,scrollContainer=$(this).find(".WEB_dialog_scroll_container"),
                scrollCell=scrollContainer.find(".WEB_dialog_cell"),
                slider=$(this).find(".WEB_dialog_scroll_slider"),
                maxTop=slider.parent().height()-slider.height(),//滚动条可以滑动的最大高度
                maxH=scrollCell.outerHeight()-scrollContainer.height(),//滚动区可以滚动的最大高度
                dragging = false,//拖拽状态
                iY;
                slider.mousedown(function(e) {//鼠标按下时的方法
                dragging = true;
                iY = e.clientY - $(this).position().top;
                return false;
            })
            $(document).mousemove(function(e) {//鼠标拖动时的方法
                if (dragging) {
                    var oY = e.clientY - iY;
                    if(oY<0){
                       oY=0 
                    }else if(oY>maxTop){
                        oY=maxTop
                    }
                    slider.css({"top":oY });
                    scrollCell.css({"top":(-oY/maxTop)*maxH});
                    return false;
                }
            })
            $(document).mouseup(function(e) {//鼠标抬起时的方法
                dragging = false;
                e.cancelBubble = true;
            })
            $(this).off("mousewheel").on("mousewheel",function(e){
                        e.preventDefault();
                        var dir=e.deltaY,//滚动方向
                            rate=dir*_this.settings.scrollerRate,//每次滚动时的高度
                            basePos=$(this).find(".WEB_dialog_cell").position().top,
                            scrollerRate;
                        basePos+=rate;
                        if(dir<0){
                            if(Math.abs(basePos)>=maxH){
                                basePos=-maxH;
                            }
                        }else{
                            if(basePos>=0){
                                basePos=0;
                            }
                        }
                        scrollCell.css({"top":basePos});
                        //联动滚动条
                        scrollerRate=basePos/maxH;
                        slider.css({"top":-maxTop*scrollerRate});
            })
        },
        _createDialogCell:function(){//为内层元素添加特定class名
            var dialogChildren=$(this).children();
            !dialogChildren.hasClass("WEB_dialog_scroll_container")?dialogChildren.addClass("WEB_dialog_cell"):null;
        }
    }
    $.fn.WEB_dialog=function(){
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
