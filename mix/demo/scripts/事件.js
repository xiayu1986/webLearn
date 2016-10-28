/**
 * Created by Administrator on 2016/10/23.
 * 事件发射及监听
 */

var events=require("events").EventEmitter;//引用事件模块
var eventEmitter=new events();//创建EventEmitter对象

eventEmitter.on("createEvent",function () {//绑定createEvent事件处理程序
    console.log("事件创建成功！");
    eventEmitter.emit("receiveData");//触发事件
});

eventEmitter.on("receiveData",function () {//绑定 createData 事件
    console.log("接收到数据")
})
eventEmitter.emit('createEvent');
console.log("执行完毕")

eventEmitter.on("console_event",function () {
    console.log("控制台事件！")
})

setTimeout(function () {
    eventEmitter.emit("console_event")
},1000)

/*--------多个监听器--------*/
eventEmitter.on("multipleEvent",function (a,b) {//在event对象上为multipleEvent事件注册监听器
    console.log("监听器1："+a+""+b)
})
eventEmitter.on("multipleEvent",function (a,b) {//在event对象上为multipleEvent事件注册监听器
    console.log("监听器2："+a+""+b)
})
eventEmitter.emit("multipleEvent","参数1","参数2");//向event对象发送multipleEvent事件

/*--------EventEmitter API--------*/
eventEmitter.addListener("taskEvent",function () {
    console.log("添加任务事件监听器到末尾")
})
eventEmitter.on("taskEvent",function () {
    console.log("任务事件监听器已注册")
})
eventEmitter.once("taskEvent",function () {
    console.log("我只触发一次")
})

eventEmitter.emit("taskEvent");
eventEmitter.emit("taskEvent");


/*--------EventEmitter 类的应用--------*/
var listener1=function () {
    console.log("第一个监听器执行")
}
var listener2=function () {
    console.log("第二个监听器执行")
}

eventEmitter.addListener("connect",listener1);
eventEmitter.on("connect",listener2);
var eventsCount=require("events").EventEmitter.listenerCount(eventEmitter,"connect");
console.log("共注册了："+eventsCount+"个监听器！")
eventEmitter.emit("connect");
eventEmitter.removeListener("connect",listener1);
console.log("不再执行第一个监听器")
eventEmitter.emit("connect");
var eventsCount=require("events").EventEmitter.listenerCount(eventEmitter,"connect");
console.log("共注册了："+eventsCount+"个监听器！");
console.log("执行完毕")