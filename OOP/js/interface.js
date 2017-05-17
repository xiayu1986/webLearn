/**
 * Created by Administrator on 2016/11/20.
 */

var Interface=function(name,methods){
    if(arguments.length!=2){
        throw new Error("接口需要传入两个参数");
    }
    this.name=name;
    this.methods=[];
    for(var i=0,len=methods.length;i<len;i++){
        if(typeof methods[i]!=="string"){
            throw new Error("函数名应为字符串");
        }
        this.methods.push(methods[i]);
    }
}
Interface.ensureImplements=function(object){
    if(arguments.length<2){
        throw new Error("该方法需要传入两个参数");
    }
    for(var i=1,len=arguments.length;i<len;i++){
        var interface=arguments[i];
        if(interface.constructor!==Interface){
            throw new Error("未实现原型中的方法")
        }
        for(var j=0,methodsLen=interface.methods.length;j<methodsLen;j++){
            var method=interface.methods[j];
            if(!object[method] || typeof object[method]!=='function'){
                throw new Error("function Interface.ensureImplements:object does not implenent the"+interface.name+"interface.Method"+method+"was not found");
            }
        }
    }
}