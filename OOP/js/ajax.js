var Ajax=function(){}
Ajax.prototype={
	constructor:Ajax,
	request:function(method,url,data,callback){
		var xhr=this.create();
		xhr.onreadystatechange=function(){
			alert("请求完成")
			if(xhr.readyState===4 && xhr.status===200){
				callback.success(xhr.responseText,xhr.responseXML)
			}else{
				callback.fail(xhr.status);	
			}
			xhr.open(method,url,true);
			xhr.send(data);
		}
	},
	create:function(){
		return window.XMLHttpRequest?new XMLHttpRequest():new ActiveXObject("Microsoft.XMLHTTP");
	}
}