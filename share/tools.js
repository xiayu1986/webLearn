/**
 * Created by Administrator on 2016/10/23.
 */

/*-------------------对象继承-------------------*/
var util=require("util");
function Base(){
    this.name="小明";
    this.base="1990";
    this.say=function () {
        console.log(this.name)
    }
}
Base.prototype.sayName=function () {
    console.log(this.name)
}
function Sub() {
    this.name="sub"
}
util.inherits(Sub,Base);
var oBase=new Base();
oBase.sayName();

var oSub=new Sub();
oSub.sayName();

/*-------------------字符串转换-------------------*/

function Person() {
    this.name="李磊";
    this.toString=function () {
        return this.name
    }
}

var obj=new Person();
console.log(util.inspect(obj))

/*-------------------是否是数组-------------------*/

console.log(util.isArray([1,2,3]))