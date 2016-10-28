/**
 * Created by Administrator on 2015/8/9.
 */
;(function($,window,document,undefined){
	var defaults={//默认配置
		isInitTree:true,//初始化的时候是否构建树
		textConf:{
			"format":"格式化",
			"compress":"压缩",
			"treeView":"生成树",
			"empty":"清空",
			"placeholder":"请在此输入您的数据"
		},
		indentClass:"    ",//缩进级别
		lineBreak:"\n"//换行符
	}
	var methods={
		init:function(options){
			return this.each(function(){
				var settings=$(this).data("WEB_format_settings");//用户配置
				if(settings){
					this.settings=$.extend(true,{},settings,options);
				}else{
					this.settings=$.extend(true,{},defaults,options);
					$(this).data("WEB_format_settings",this.settings);
				}
				methods._createFormatContainer.call(this);//创建容器
			})
		},
		_createFormatContainer:function(){//构建容器
			var formatContainer=$(this).find(".WEB_format_container");
			if(formatContainer.length>0){//仅创建一次容器
				return;
			}
			var formatHtml='<div class="WEB_format_container">\
							<div class="WEB_format_tree"></div>\
							<div class="WEB_format_source">\
								<div class="WEB_format_option">\
									<div class="actionBtn format">'+this.settings.textConf.format+'</div>\
									<div class="actionBtn compress">'+this.settings.textConf.compress+'</div>\
									<div class="actionBtn treeView">'+this.settings.textConf.treeView+'</div>\
									<div class="actionBtn empty">'+this.settings.textConf.empty+'</div>\
								</div>\
								<div class="WEB_format_data">\
									<textarea class="WEB_format_area" placeholder="'+this.settings.textConf.placeholder+'"></textarea>\
								</div>\
								<div class="WEB_format_message"></div>\
							</div>\
							</div>';
			$(this).html(formatHtml);
			methods._createFormatEvents.call(this);//创建容器事件
		},
		_createFormatEvents:function(){//绑定事件

		},
		_formatData:function(data,isCompress){//格式化数据,data:数据，isCompress:是否压缩>true:是，false:否
			var draw=[],//保存解析后的数据
				line=this.settings.lineBreak,//换行符
				ind=this.settings.indentClass,//缩进符
				nodeCount=0,//最大节点数量
				maxDepth=0,//最大深度
				message=$(this).find(".WEB_format_message"),//消息显示区
				area=$(this).find(".WEB_format_area");//数据操作区
			if(isCompress){//如果压缩去除换行 空格
				line=ind="";
			}
			var readData=function(name,value,isLast,indent,formObj){

				nodeCount++;//递增节点

				for (var i=0,tab='';i<indent;i++ ){//递增缩进
					tab+=ind
				}

				maxDepth=++indent;//递增级别

				if($.type(value)==='array'){//处理数组
						draw.push(tab+(formObj?('"'+name+'":'):'')+'['+line);/*缩进'[' 然后换行*/
						for (var i=0;i<value.length;i++){
							readData(i,value[i],i==value.length-1,indent,false);
						};
						draw.push(tab+']'+(isLast?line:(','+line)));/*缩进']'换行,若非尾元素则添加逗号*/
				}else if($.type(value)==='object'){//处理对象
						draw.push(tab+(formObj?('"'+name+'":'):'')+'{'+line);//缩进'{' 然后换行
						var len=0,i=0;
						for(var key in value){
							len++
						};
						for(var key in value){
							readData(key,value[key],++i==len,indent,true)
						};
						draw.push(tab+'}'+(isLast?line:(','+line)));//缩进'}'换行,若非尾元素则添加逗号
				}else{
						if(typeof value=='string'){
							value='"'+value+'"'
						};
						draw.push(tab+(formObj?('"'+name+'":'):'')+value+(isLast?'':',')+line);
				}
			}
			readData('',data,true,0,false);//调用
			message.html('共处理节点<b>'+nodeCount+'</b>个,最大树深为<b>'+maxDepth+'</b>');
			area.val(draw.join(''));
		},
		_createTreeView:function(){//生成树

		}

}
    
    $.fn.WEB_format=function(){
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
