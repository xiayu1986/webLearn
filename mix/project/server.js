var express = require('express'),//调用 express模块
    path = require('path'),//调用路径解析模块
    http=require("http"),//调用http模块
    routes = require('./routes/router'),//首页路由模块
    app = express(),//创建应用
    port=8000,//定义端口
    server = http.createServer(app);//创建服务器

server.listen(port);//监听端口
app.set('views', path.join(__dirname, 'views'));//指定模板目录
app.set('view engine', 'ejs');//设置使用ejs模板引擎
app.use(express.static(path.join(__dirname, 'public')));//发布静态资源
app.use('/', routes);//调用路由文件
app.use('/load', routes);//调用路由文件
