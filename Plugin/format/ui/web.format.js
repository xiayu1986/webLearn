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
		lineBreak:"\n",//换行符
		ico:{/* 树图标 */
			//文件夹结构线
			r0:'img18.gif',
			r0c:'img19.gif',
			r1:'img20.gif',
			r1c:'img21.gif',
			r2:'img22.gif',
			r2c:'img23.gif',
			//前缀图片
			nl:'img24.gif',
			vl:'img25.gif',
			//文件结构线
			f1:'img26.gif',
			f2:'img27.gif',
			root:'img28.gif',
			//文件夹
			arr:'img29.gif',
			arrc:'img30.gif',
			obj:'img31.gif',
			objc:'img32.gif',
			//文件
			arr2:'img33.gif',
			obj2:'img34.gif'
		},
		img:"",
		root:"根节点",
		name:""
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
			var area=$(this).find(".WEB_format_area"),
				_this=this;
			$(this).off(".format").on("click.format",".actionBtn",function () {//格式化
				if($(this).hasClass("empty")){//清空
					area.val("");
				}else{
					var sourceData=area.val(),
						isCompress=$(this).hasClass("compress")?true:false,
						checkOut=methods._checkOutJson.call(_this,sourceData);
					console.log("校验")
					if($.type(checkOut)!=="object"){
						return;
					}
					if($(this).hasClass("treeView")){//生成树
						methods._createTreeView.call(_this,checkOut.data);
					}else{
						methods._formatData.call(_this,checkOut.data,isCompress);
					}
				}
			})
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
						if($.type(value)=='string'){
							value='"'+value+'"'
						};
						draw.push(tab+(formObj?('"'+name+'":'):'')+value+(isLast?'':',')+line);
				}
			}
			readData('',data,true,0,false);//调用
			message.html('共处理节点<b>'+nodeCount+'</b>个,最大树深为<b>'+maxDepth+'</b>');
			area.val(draw.join(''));
		},
		_checkOutJson:function (sourceData) {//校验数据格式是否正确
			var message=$(this).find(".WEB_format_message"),
				jsonRule=/^\s*(\[\n*(\n*.*)*\n*\]|\{\n*(\n*.*)*\n*\})\s*$/g;
			if(sourceData===""){
				message.html("数据不能为空！");
				return false;
			}else if(jsonRule.test(sourceData)){
				message.html("");
				try{
					var resultData=eval('('+sourceData+')');
				}catch(e){
					message.html("数据格式化出错！");
					return false;
				}
			}else{
				message.html("数据格式不匹配！");
				return false;
			}
			message.html("");
			return {"result":true,"data":resultData};
		},
		_createTreeView:function(sourceData){//生成树
			var draw=[],_this=this,ico=this.settings.ico;
			var notify=function(prefix,lastParent,name,value,formObj){/* 构造子节点 */
				/*prefix:生成多少图片起到缩进的作用
				lastParent：父是否是尾节点(确定图标是空白|结构线)
				name：节点名
				value：节点值
				formObj：父是否是对象(确定子图标)*/
				var rl=prefix==''?ico.r0:lastParent?ico.r1:ico.r2;//配置根节点图标

				if($.type(value)=="array"){/* 处理数组节点 */
					draw.push('<dl><dt>',methods.draw.call(_this,prefix,rl,ico.arr,name,''),'</dt><dd>');/* 绘制文件夹 */
					for (var i=0;i<value.length;i++){
						notify(prefix+methods._createImage(lastParent?ico.nl:ico.vl),i==value.length-1,i,value[i]);
						draw.push('</dd></dl>');
					}
				}else	if($.type(value)=='object'){/* 处理对象节点 */
					draw.push('<dl><dt>',methods.draw.call(_this,prefix,rl,ico.obj,name,''),'</dt><dd>');/* 绘制文件夹 */
					var len=0,i=0;
					for(var key in value){len++};/* 获取对象成员总数 */
					for(var key in value){
						notify(prefix+methods._createImage(lastParent?ico.nl:ico.vl),++i==len,key,value[key],true)
					};
					draw.push('</dd></dl>');
				}else{/* 处理叶节点(绘制文件) */
					draw.push('<dl><dt>',methods.draw.call(_this,prefix,lastParent?ico.f1:ico.f2,formObj?ico.obj2:ico.arr2,name,value),'</dt></dl>');
				}
			};
			if($.isEmptyObject(sourceData)){//空对象不绘制
				return;
			}
			notify('',true,this.settings.root,sourceData);
			$(this).find(".WEB_format_tree").html(draw.join(''));
		},draw:function(prefix,line,ico,name,value){/* 子项HTML构造器 */
			var cmd=false,J=this.settings.ico,imgName=false;
			switch (line)	{//传递切换图标
				case J.r0:imgName='r0';break;
				case J.r1:imgName='r1';break;
				case J.r2:imgName='r2';
			}
			if(imgName)cmd=' onclick="'+this.name+'.show(this,\''+imgName+'\')" ';/* 加入折叠命令 */
			return prefix+methods._createImage(line,cmd)
				+this.settings.img+' <a href="javascript:void(0)">'
				+methods._createImage(ico)+'</a> <a href="javascript:void(0)"'
				+'key="'+name+'" val="'+value+'" >'
				+name+(value==''?'':':')+value+'</a>'
		},
		_createImage:function(src,attr){//创建图片
			return '<img src="'+src+'" '+(attr||'')+'  />';
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
