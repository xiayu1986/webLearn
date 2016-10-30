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
		indentClass:4,//缩进级别
		lineBreak:"\n",//换行符
		icoClass:{
		},
		root:"根节点",
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
			var ind='';
			for(var i=0;i<this.settings.indentClass;i++){
				ind+=" ";//缩进量
			}
			var draw=[],//保存解析后的数据
				line=this.settings.lineBreak,//换行符
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
		_createTreeView:function(sourceData){//生成树形结构
			var draw=[],_this=this,nodeCount=0,maxDepth=0;//draw：存储绘制的节点HTML,nodeCount:节点数量,maxDepth:最大深度
			var notify=function(name,value,isLast,indent){//name:数据键，value:数据值，isLast是否是最后一个节点，indent:缩进量
				nodeCount++;//统计节点总数
				maxDepth=++indent;//统计最大树深
				var totalLen=0;//数组或对象的长度
				if(name==="root"){//根节点输出开始标签
					draw.push('<ul class="root-tree"><li class="root-tree-items">','<div class="node-name">'+methods._createTreeIcon(name,value,isLast,indent)+'</div>');
				}
				if($.type(value)==="array"){
					totalLen=value.length;
				}else if($.type(value)==="object"){
					$.each(value,function () {
						totalLen++
					})
				}
				if(typeof value==="object"){//处理数组或对象的输出
				 	draw.push('<ul class="node-tree">');
					var keyIndex=0,
						isLastNode=false;//是否是最后一个节点
					$.each(value,function (key,val) {
						if($.type(value)==="array"){
							isLastNode=(key===(totalLen-1))?true:false;
						}else if($.type(value)==="object"){
							keyIndex++;
							isLastNode=(keyIndex===totalLen)?true:false;
						}
						if(typeof val==="object"){
							draw.push('<li class="node-tree-items"><div>'+methods._createTreeIcon(key,val,isLastNode,indent)+key+'</div>');
						}else{
							draw.push('<li class="node-tree-items">');
						}
						notify(key,val,isLastNode,indent);
						draw.push('</li>');
					})
				 	draw.push('</ul>');
				 }else{//处理子节点的输出
					if($.type(value)==="string"){
						value='"'+value+'"';
					}
				 	draw.push('<div class="node-name">'+methods._createTreeIcon(name,value,isLast,indent)+'"'+name+'"：'+value+'</div>');
				 }
				if(name==="root"){//根节点输出结束标签
					draw.push('</li></ul>');
				}
			}
			if($.isEmptyObject(sourceData)){//空对象不绘制
				return;
			}
			notify('root',sourceData,true,0);//绘制根节点
			$(this).find(".WEB_format_tree").html(draw.join(''));//将绘制好的结构添加到树形结构区
			console.log("节点总数："+nodeCount+"最大树深："+maxDepth);
		},
		_createTreeIcon:function(name,value,isLastNode,indent){//创建节点图标
			var nodeName='',result='',foldIcon='',typeIcon='',indentIcon='',lineIcon='';
			console.log("键："+name+(isLastNode?"是":"不是")+"最后一个节点");
			if(name==="root"){
				nodeName="根节点"
			}

			if($.type(value)==="array"){//确定节点类型及展开/收缩图标
				typeIcon='<span class="tree-icon tree-icon-array"></span>';
				foldIcon='<span class="tree-icon tree-icon-close"></span>';
			}else if($.type(value)==="object"){
				typeIcon='<span class="tree-icon tree-icon-object"></span>';
				foldIcon='<span class="tree-icon tree-icon-close"></span>';
			}else if($.type(value)==="number"||$.type(value)==="function"){
				typeIcon='<span class="tree-icon tree-icon-number"></span>';
			}else{
				typeIcon='<span class="tree-icon tree-icon-default"></span>';
			}

			for(var i=0;i<indent;i++){
				if(name!=="root"){
					var className='tree-icon';
					if(i>0){
						if(isLastNode){
							if(i===indent-1 && typeof value !=="object"){
								className='tree-icon tree-icon-end'
							}else{
								className='tree-icon tree-icon-line'
							}
						}else{
							if(i===indent-1 && typeof value !=="object"){
								className='tree-icon tree-icon-join'
							}else{
								className='tree-icon tree-icon-line'
							}
						}
					}
					indentIcon+='<span class="'+className+'"></span>';
				}
			}
			result=indentIcon+foldIcon+typeIcon+nodeName;
			return result;
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
