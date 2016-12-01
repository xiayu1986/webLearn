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
			"root":"根节点",
			"placeholder":"请在此输入您的数据"
		},
		indentClass:4,//缩进级别
		lineBreak:"\n",//换行符
		expandAll:false//是否展开所有节点
	};
	var methods={
		init:function(options){//初始化
			return this.each(function(){
				var settings=$(this).data("WEB_format_settings");//用户配置
				if(settings){
					this.settings=$.extend(true,{},settings,options);
				}else{
					this.settings=$.extend(true,{},defaults,options);
					$(this).data("WEB_format_settings",this.settings);
				}
				methods._createFormatContainer.call(this);//创建容器
			});
		},
		_createFormatContainer:function(){//构建容器
			var formatContainer=$(this).find(".WEB_format_container");
			if(formatContainer.length>0){//仅创建一次容器
				return;
			}
			var formatHtml='<div class="WEB_format_container">'+
							'<div class="WEB_format_tree"></div>'+
							'<div class="WEB_format_source">'+
								'<div class="WEB_format_option">'+
									'<div class="actionBtn format">'+this.settings.textConf.format+'</div>'+
									'<div class="actionBtn compress">'+this.settings.textConf.compress+'</div>'+
									'<div class="actionBtn treeView">'+this.settings.textConf.treeView+'</div>'+
									'<div class="actionBtn empty">'+this.settings.textConf.empty+'</div>'+
								'</div>'+
								'<div class="WEB_format_data">'+
									'<textarea class="WEB_format_area" placeholder="'+this.settings.textConf.placeholder+'"></textarea>'+
								'</div>'+
								'<div class="WEB_format_message"></div>'+
							'</div>'+
							'</div>';
			$(this).html(formatHtml);
			methods._createFormatEvents.call(this);//创建容器事件
		},
		_createFormatEvents:function(){//绑定事件
			var area=$(this).find(".WEB_format_area"),
				treeView=$(this).find(".WEB_format_tree"),
				message=$(this).find(".WEB_format_message"),
				_this=this;
			$(this).off(".format").on("click.format",".actionBtn",function () {//格式化
				if($(this).hasClass("empty")){//清空
					area.val("");
					treeView.html('');
					message.html('');
				}else{
					var sourceData=area.val(),
						isCompress=$(this).hasClass("compress")?true:false,
						checkOut=methods._checkOutJson.call(_this,sourceData);
					if($.type(checkOut)!=="object"){
						return;
					}
					if($(this).hasClass("treeView")){//生成树
						methods._createTreeView.call(_this,checkOut.data);
					}else{
						methods._formatData.call(_this,checkOut.data,isCompress);
					}
				}
			});
			area.on("input keyup",function () {
				var sourceData=area.val(),
					checkOut=methods._checkOutJson.call(_this,sourceData);
				if($.type(checkOut)!=="object"){
					return;
				}
					methods._createTreeView.call(_this,checkOut.data);
			});

			treeView.on("click",".node-name",function(){//点击nodeName节点时展开 或 收起元素
				var node=$(this).siblings("ul"),iconNode=$(this).find(".tree-icon"),typeNode=iconNode.eq(iconNode.length-2);
				if(node.length===0){
					return;
				}
				if(node.hasClass('node-tree-close')){
					node.removeClass("node-tree-close").addClass('node-tree');
					typeNode.removeClass('tree-icon-open').addClass('tree-icon-close');
				}else{
					node.removeClass("node-tree").addClass('node-tree-close');
					typeNode.removeClass('tree-icon-close').addClass('tree-icon-open');
				}
			});
		},
		_formatData:function(data,isCompress){//格式化数据,data:数据，isCompress:是否压缩>true:是，false:否
			var ind='';
			for(var i=0;i<this.settings.indentClass;i++){
				ind+=" ";//缩进量
			}
			var draw=[],//保存解析后的数据
				line=this.settings.lineBreak,//换行符
				nodeCount=0,//最大节点数量
				maxDepth=0,//最大深度
				depArr=[],
				message=$(this).find(".WEB_format_message"),//消息显示区
				area=$(this).find(".WEB_format_area");//数据操作区
			if(isCompress){//如果压缩去除换行 空格
				line=ind="";
			}
			var readData=function(name,value,isLast,indent,formObj){
				nodeCount++;//递增节点
				for (var i=0,tab='';i<indent;i++ ){//递增缩进
					tab+=ind;
				}
				maxDepth=++indent;//递增级别
				depArr.push(maxDepth);
				if($.type(value)==='array'){//处理数组
						draw.push(tab+(formObj?('"'+name+'":'):'')+'['+line);/*缩进'[' 然后换行*/
						for (var j=0;j<value.length;j++){
							readData(j,value[j],j==value.length-1,indent,false);
						}
						draw.push(tab+']'+(isLast?line:(','+line)));/*缩进']'换行,若非尾元素则添加逗号*/
				}else if($.type(value)==='object'){//处理对象
						draw.push(tab+(formObj?('"'+name+'":'):'')+'{'+line);//缩进'{' 然后换行
						var len=0,n=0;
						for(var a in value){
							len++;
						}
						for(var k in value){
							readData(k,value[k],++n==len,indent,true);
						}
						draw.push(tab+'}'+(isLast?line:(','+line)));//缩进'}'换行,若非尾元素则添加逗号
				}else{
						if($.type(value)=='string'){
							value='"'+value+'"';
						}
						draw.push(tab+(formObj?('"'+name+'":'):'')+value+(isLast?'':',')+line);
				}
			};
			readData('',data,true,0,false);//调用
			maxDepth=Math.max.apply(null,depArr);
			message.html('共处理节点<b>'+nodeCount+'</b>个,最大节点深度为<b>'+maxDepth+'</b>');
			area.val(draw.join(''));
		},
		_checkOutJson:function (sourceData) {//校验数据格式是否正确
			var message=$(this).find(".WEB_format_message"),
				jsonRule=/^\s*\[|\{(\n*.*)*\s*$/g;
			if(sourceData===""){
				message.html("数据不能为空！");
				return false;
			}else if(jsonRule.test(sourceData)){
				message.html("");
				try{
					sourceData=eval('('+sourceData+')');
				}catch(e){
					message.html("数据格式化出错！");
					return false;
				}
			}else{
				message.html("数据格式不匹配！");
				return false;
			}
			message.html("");
			return {"result":true,"data":sourceData};
		},
		_createTreeView:function(sourceData){//生成树形结构
			var draw=[],_this=this;//draw：存储绘制的节点HTML
			var notify=function(prefix,lastParent,name,value,fromObj){
				/*prefix:前缀图标
				lastParent:父节点是否是最后一级
				name:键
				value:值
				fromObj:父节点是否是对象
				*/

				var totalLen=0,//数组或对象的长度
					rootIconClassName=_this.settings.expandAll?'tree-icon tree-icon-close':'tree-icon tree-icon-open';/* 配置根节点图标 */
				if($.type(value)==="array"){
					totalLen=value.length;
				}else if($.type(value)==="object"){
					$.each(value,function () {
						totalLen++;
					});
				}
				//nodeCount++;//统计节点总数
				//maxDepth=++indent;//统计最大树深
				//depArr.push(maxDepth);
				if(name==="root"){//根节点输出开始标签
					draw.push('<ul class="node-tree">');
				}
				draw.push('<li class="node-tree-item">');
				if( $.type(value)==="array" || $.type(value)==="object"){//遍历数组或对象
					draw.push('<div class="node-name">',methods._createTreeIcon.call(_this,prefix,rootIconClassName,'tree-icon tree-icon-'+$.type(value),name,''),'</div>');
					var nodeTreeClassName=_this.settings.expandAll?"node-tree":"node-tree-close";
					draw.push('<ul class="'+nodeTreeClassName+'">');//输出对象的根节点
						var keyIndex=0,isLastNode=false/*是否是最后一个节点*/,isObj=false/*是否是对象*/;
							$.each(value,function(key,val){//递归对象或数组
								if($.type(value)==="array"){
									isLastNode=(key===(totalLen-1))?true:false;
								}else if($.type(value)==="object"){
									keyIndex++;
									isObj=true;
									isLastNode=(keyIndex===totalLen)?true:false;
								}
								notify(prefix+methods._createPrefixIcon.call(_this,prefix===""?"tree-icon":lastParent?"tree-icon":"tree-icon tree-icon-line"),isLastNode,key,val,isObj);
							});
					draw.push('</ul>');//输出对象的根节点
				}else{//输出叶子节点
					draw.push('<div class="node-leaf">',methods._createTreeIcon.call(_this,prefix,lastParent?"tree-icon tree-icon-end":"tree-icon tree-icon-join",fromObj?"tree-icon tree-icon-default":"tree-icon tree-icon-number",name,value),'</div>');
				}
				draw.push('</li>');
				if(name==="root"){//根节点输出结束标签
				 	draw.push('</ul>');
				}
			};
			if($.isEmptyObject(sourceData)){//空对象不绘制
				$(this).find(".WEB_format_message").html('无法绘制空对象！');
				return;
			}
			notify('',true,this.settings.textConf.root,sourceData,false);//绘制根节点

			$(this).find(".WEB_format_tree").html(draw.join(''));//将绘制好的结构添加到树形结构区
			// maxDepth=Math.max.apply(null,depArr);
			// $(this).find(".WEB_format_message").html('共处理节点<b>'+nodeCount+'</b>个,最大节点深度为<b>'+maxDepth+'</b>');
		},
		_createTreeIcon:function(prefix,line,ico,name,value){//创建节点图标
			if(value && $.type(value)==="string"){
				value='"'+value+'"';
			}
			return prefix+methods._createPrefixIcon(line)+methods._createPrefixIcon(ico)+name+(value===''?'':":")+value;
		},
		_createPrefixIcon:function(className){
			return '<span class="'+className+'"></span>';
		},
		openAllNode:function(){//展开所有节点

		},
		closeAllNode:function(){//收起所有节点

		}
	};
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
	};
})(jQuery,window,document);
