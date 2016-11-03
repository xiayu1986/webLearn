var express = require('express'),
    path = require('path'),
    routes = require('./routes/index'),
    http=require("http"),
    app = express(),
    server=http.createServer(app),//创建服务器
    io = require('socket.io')(server),//创建websocket服务器
    onlineUsers = {},//在线用户列表
    onlineCount = 0;//在线人数
io.on("connection",function (socket) {
    socket.on('login', function(obj){//监听用户登录
      socket.name = obj.userid;
      if(!onlineUsers.hasOwnProperty(obj.userid)) {//检查用户列表
        onlineUsers[obj.userid] = obj.username;//存储用户
        onlineCount++;//递增在线人数
      }
      io.emit('login', {onlineUsers:onlineUsers, onlineCount:onlineCount, user:obj});//向所有客户端推送用户加入消息
    });
    socket.on('disconnect', function(){//监听用户退出
      if(onlineUsers.hasOwnProperty(socket.name)) { //将退出的用户从在线列表中删除
        var obj = {userid:socket.name, username:onlineUsers[socket.name]};//取退出用户的信息
        delete onlineUsers[socket.name]; //删除退出用户信息
        onlineCount--;//递减在线人数
        io.emit('logout', {onlineUsers:onlineUsers, onlineCount:onlineCount, user:obj});//向所有客户端推送用户退出信息
      }
    });
    socket.on("message",function (obj) {//监听用户消息
      io.emit('message', obj);//向所有客户端推送用户发送的消息
    });
})
server.listen(3000);

//模板引擎设置
app.set('views', path.join(__dirname, 'views'));//指定模板引擎目录
app.set('view engine', 'ejs');//指定模板引擎类型

app.use(express.static(path.join(__dirname, 'public')));//发布静态资源
app.use('/', routes);//路由
