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
}