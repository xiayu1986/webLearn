/**
 * Created by Administrator on 2015/8/9.
 */
;(function($,window,document,undefined){
    var defaults={//默认配置
        trigger:"click",
        defaultDate:"2016-01-16",
        startDate:"",
        endDate:"",
        change:function(value){

        },
        beforeOpen:function(){},//日历组件调用前执行的方法
        afterOpen:function(){},//日历组件调用后执行的方法
        afterClose:function(){},//日历组件关闭后执行的方法
        beforeClose:function(){},//日历组件关闭前执行的方法
    }
    
    var methods={
        init:function(options,e){
            return this.each(function(){
                var settings=$(this).data("WEB_datePicker_settings");//用户配置
                this.Event=e||{};
                if(settings){
                    this.settings=$.extend(true,{},settings,options);
                }else{
                    this.settings=$.extend(true,{},defaults,options);
                    $(this).data("WEB_datePicker_settings",this.settings);
                }
                methods._createCalendar.call(this);//调用日历组件
            })
        },
        _createCalendar:function(){
            var _this=this,nameSpace=".calendar";
            $(this).off(nameSpace).on(_this.settings.trigger+nameSpace,function (e) {
                e.stopPropagation();
                methods._createCalendarElement.call(_this);
            })
        },
        _isLeapYear:function(year){
            if(year){
                return (year%4==0 && year%100!=0)||(year%400==0)?true:false;//true为闰年,false为平年
            }
        },
        _getNowDate:function () {
            var defaultDate=$(this).val()||this.settings.defaultDate,
                dateRule=/^(?:(?!0000)[0-9]{4}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)-02-29)$/;
            if($.type(defaultDate)!="string"){
                alert("默认日期格式不正确！");
                return;
            }
            if(defaultDate=="now" || !defaultDate || !dateRule.test(defaultDate)){
                defaultDate=new Date();
            }else{
                defaultDate=new Date(defaultDate)
            }
            return defaultDate;
        },
        _createCalendarElement:function(initDate) {
            var _this = this,
                defaultDate = initDate || methods._getNowDate.call(this),
                Y = "",//年
                M = "",//月
                D = "",//日
                Day = "",//星期
                matchRule = /(\d{4})-(\d{2})-(\d{2})|(\d{4})\/(\d{2})\/(\d{2})/gi;
            Y = defaultDate.getFullYear();
            M = defaultDate.getMonth() + 1;
            D = defaultDate.getDate();
            Day = parseInt(defaultDate.getDay());
            var leapYear = methods._isLeapYear(Y),
                loop = 30,
                D31 = [1, 3, 5, 7, 8, 10, 12],
                dayNames = ["日", "一", "二", "三", "四", "五", "六"];
            if (M == 2) {
                loop = leapYear ? 29 : 28;
            } else {
                if (D31.indexOf(M) > -1) {
                    loop = 31
                }
            }
            var dateContainer = null,daysHtml='',curDate='',startDay;
            if ($(".WEB_datePicker").length == 0) {
                dateContainer = $('<div class="WEB_datePicker"><div class="WEB_datePicker_title"><a class="prev">&lt;</a><div class="dateNow">' + Y + '年' + M + '月</div><a class="next">&gt;</a></div></div>');
                dateContainer.appendTo($("body"));
                var weeks = $('<div class="WEB_datePicker_week"></div>'), weeksHtml = "", $this = $(this);//创建星期
                $.each(dayNames, function (ind, val) {
                    weeksHtml += '<span>' + val + '</span>'
                })
                weeks.html(weeksHtml);
                weeks.appendTo(dateContainer);

                var days = $('<div class="WEB_datePicker_day"></div>');//创建日期
                for (var i = 0; i < loop; i++) {
                    if (i == D - 1) {
                        curDate = 'class="selectDate curDate"';
                    } else if (i > D - 1) {
                        curDate = 'class="selectDate"';
                    } else {
                        curDate = ''
                    }
                    daysHtml += '<a href="javascript:" ' + curDate + '>' + (i + 1) + '</a>'
                }
                for (var n = 0; n < Day; n++) {//从星期几开始显示日期
                    startDay += '<a href="javascript:" class="empty"></a>';
                }
                days.html(startDay + daysHtml);
                days.appendTo(dateContainer);
            }else{
                $(".WEB_datePicker").css({"display":"block"});
                $(".dateNow").html(Y+'年'+M+'月');
                for(var i=0;i<loop;i++){
                    if(i==D-1){
                        curDate='class="selectDate curDate"';
                    }else if(i>D-1){
                        curDate='class="selectDate"';
                    }else{
                        curDate=''
                    }
                    daysHtml+='<a href="javascript:" '+curDate+'>'+(i+1)+'</a>'
                }
                for(var n=0;n<Day;n++){//从星期几开始显示日期
                    startDay+='<a href="javascript:" class="empty"></a>';
                }
                $(".WEB_datePicker_day").html(startDay+daysHtml);
            }
            if(arguments.length==0){
                methods._setCalendarPosition.call(this);//设置日历位置
                methods._createCalendarEvents.call(this);//为元素绑定事件
            }

        },
        _createCalendarEvents:function(){//为创建好的元素绑定事件
            var _this=this,$this=$(this);
            $(".WEB_datePicker").off(".select").on("click.select",".selectDate",function(){
                var value=$(this).text(),str=Y+"-"+methods._convert(M,2)+"-"+methods._convert(value,2);
                $this.val(str);
                if($.isFunction(_this.settings.change)){
                    _this.settings.change.call(_this,str)
                }
                $(this).parents(".WEB_datePicker").css({"display":"none"});
            })
            $(".WEB_datePicker").on("click",function(e){
                e.stopPropagation();
            })

            $(document).on("click",function(){
                $(".WEB_datePicker").css({"display":"none"});
            })
            var now=methods._getNowDate.call(this);//取当前时间
            var M=now.getMonth()+1,Y=now.getFullYear();
            $(".next").off("click").on("click",function(){
              if(M==12){
                M=1;
                Y++;
              }else{
                M++;
              }
              var newDateStr=Y+"-"+methods._convert(M,2)+"-01",curDate=new Date(newDateStr);
              methods._createCalendarElement.call(_this,curDate);
            })

            $(".prev").off("click").on("click",function(){
              if(M==1){
                M=12;
                Y--;
              }else{
                M--;   
              }
              var newDateStr=Y+"-"+methods._convert(M,2)+"-01",curDate=new Date(newDateStr);
              methods._createCalendarElement.call(_this,curDate);
            })

            $(document).on("keydown",function(e){
                if(e.keyCode==37){
                      if(M==1){
                        M=12;
                        Y--;
                      }else{
                        M--;   
                      }
                      var newDateStr=Y+"-"+methods._convert(M,2)+"-01",newDate=new Date(newDateStr);
                      methods._createCalendarElement.call(_this,newDate);
                }

                if(e.keyCode==39){
                      if(M==12){
                        M=1;
                        Y++;
                      }else{
                        M++;
                      }
                      var newDateStr=Y+"-"+methods._convert(M,2)+"-01",newDate=new Date(newDateStr);
                      methods._createCalendarElement.call(_this,newDate);
                }
            })
        },
        _convert:function(num,len){
            var str=num.toString();
            while(str.length<len){
                str="0"+str;
            }
            return str;
        },
        _setCalendarPosition:function () {

            var L=$(this).offset().left,
                T=$(this).offset().top,
                H=$(this).outerHeight(),
                B=parseInt($(this).css("borderBottomWidth")),
                EW=$(".WEB_datePicker_week span:first").outerWidth(),
                calendar=$(".WEB_datePicker");
            T+=H;
            T-=B;
            $(".WEB_datePicker_day").css({"width":EW*7});
            calendar.css({"left":L,"top":T});
        }

    }

    $.fn.WEB_datePicker=function(){
        var ieVersion=navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion .split(";")[1].replace(/[ ]/g,"");
        if(ieVersion=="MSIE7.0" || ieVersion=="MSIE6.0"|| ieVersion=="MSIE5.0"){
            alert("您的浏览器版本过低，本插件无法提供支持，请升级！");
            return;
        }
        var method=arguments[0],ARG;
        if(methods[method]){
            method=methods[method];
            ARG=Array.prototype.slice.call(arguments,1);
        }else if(typeof method ==="object" || !method){
            method=methods.init;
            ARG=arguments;
        }else{
            $.error("方法未正确调用");
            return this;
        }
        method.apply(this,ARG);
        return this;
    }
})(jQuery,window,document);
