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
	var defaults={//默认配置
	     totalPage:100,//总页数
	     curPage:10,//可视区显示数量
	     prev_text:"上一页",//上一页显示的文本
	     next_text:"下一页",//下一页显示的文本
	     show_prev:true,//是否显示上一页
	     show_next:true,//是否显示下一页
	     show_first:true,//是否显示第一页
	     show_last:true,//是否显示最后一页
	     first_text:"首页",//第一页显示文本
	     last_text:"尾页",//最后一页显示文本
	     show_pagination_info:true,//是否显示分页信息
	     show_pagination_list:true,//是否显示分页列表
	     show_pagination_content:true,//是否显示分页页码
	     change:function(){}//分页事件触发时执行的方法
	}
	var methods={
		init:function(options){
			return this.each(function(){
                var $this=$(this),settings=$(this).data("WEB_pagination_settings");//用户配置
                if(settings){
                    this.settings=$.extend(true,{},settings,options);
                }else{
                    this.settings=$.extend(true,{},defaults,options);
                    $(this).data("WEB_pagination_settings",this.settings);
                }
                methods._createPagination.call(this);//创建分页
            })
		},
		_createPagination:function(){//创建分页
			methods._createPaginationInfo.call(this);
			methods._createPaginationList.call(this);
			methods._createPaginationContent.call(this);
		},
		_createPaginationInfo:function(){//创建分页信息
			if(!this.settings.show_pagination_info){
				return;
			}
			$(this).find(".WEB_pagination_info").remove();
			var WEB_pagination_info=$('<div class="WEB_pagination_info">总共<span class="WEB_pagination_total">'+this.settings.totalPage+'</span>页,当前是第<span class="WEB_pagination_current">1</span>页</div>');
			$(this).prepend(WEB_pagination_info);
		},
		_createPaginationList:function(){//创建分页列表
			if(!this.settings.show_pagination_list){
				return;
			}
			$(this).find(".WEB_pagination_list").remove();
			var WEB_pagination_list_items="";
			for(var i=0;i<this.settings.totalPage;i++){
				WEB_pagination_list_items+='<li class="WEB_pagination_list_item">'+(i+1)+'</li>';
			}
			var WEB_pagination_list=$('<div class="WEB_pagination_list">跳转至第<div class="WEB_pagination_list_container">\
				<span class="jump_flag"></span>\
				<div class="WEB_jump_container"><input type="text" class="WEB_jump_number" /></div>\
				<div class="WEB_pagination_menu_container"><ul class="WEB_pagination_list_menu">\
				'+WEB_pagination_list_items+'\
				</ul></div></div>页<a class="confirmJump" href="javascript:">确定</a></div>');
			$(this).append(WEB_pagination_list);
			methods._paginationListInteractive.call(this);
		},
		_createPaginationContent:function(){//创建分页内容
			if(!this.settings.show_pagination_content){
				return;
			}
			$(this).find(".WEB_pagination_content").remove();
			var WEB_pagination_content="",firstHtml="",prevHtml="",WEB_pagination_number="",nextHtml="",lastHtml="",activeClass="";
			if(this.settings.show_first){//如果显示第一页
				firstHtml='<a href="javascript:" class="pageNumber firstPage">'+this.settings.first_text+'</a>';
			}

			if(this.settings.show_prev){//如果显示上一页
				prevHtml='<a href="javascript:" class="pageNumber prevPage">'+this.settings.prev_text+'</a>';
			}

			for(var i=0;i<this.settings.curPage;i++){//循环页码
				if(i==0){
					activeClass="pageNumber number_active"
				}else{
					activeClass="pageNumber"
				}
				WEB_pagination_number+='<a href="javascript:" class="'+activeClass+'">'+(i+1)+'</a>';
			}

			if(this.settings.show_next){//如果显示下一页
				nextHtml='<a href="javascript:" class="pageNumber nextPage">'+this.settings.next_text+'</a>';
			}

			if(this.settings.show_last){//如果显示最后一页
				lastHtml='<a href="javascript:" class="pageNumber lastPage">'+this.settings.last_text+'</a>';
			}

			WEB_pagination_content=$('<div class="WEB_pagination_content">'+firstHtml+prevHtml+WEB_pagination_number+nextHtml+lastHtml+'</div>');
			$(this).append(WEB_pagination_content);
		},
		_paginationListInteractive:function(){//构造分页列表交互

		}
	}
    
    $.fn.WEB_pagination=function(){
    	if(!$.isBrowerSupportWebPlugin()){
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
