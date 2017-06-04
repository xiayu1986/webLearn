Object.prototype.extend=function(superClass){
    var F=function(){}
    F.prototype=superClass.prototype;//避免创建超类的实例
    this.prototype=new F();
    this.prototype.constructor=this;
    this.superClass=superClass.prototype;
    if(superClass.prototype.constructor==Object.prototype.constructor){
        superClass.prototype.constructor=superClass;
    }
}


function clone(object){//对象复制
	function F(){}
	F.prototype=object;
	return new F;
}


function merge(receiveClass,giveClass){//复制方法及属性
	if(arguments[2]){
		for(var i=2;i<arguments.length;i++){
			receiveClass.prototype[arguments[i]]=giveClass.prototype[arguments[i]]
		}
	}else{
		for(methodName in giveClass.prototype){
			if(!receiveClass.prototype[methodName]){
				receiveClass.prototype[methodName]=giveClass.prototype[methodName]
			}
		}
	}
}