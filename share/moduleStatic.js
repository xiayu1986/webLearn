/**
 * Created by Administrator on 2016/10/23.
 * 用来发布静态资源
 */
var express=require("express"),
    app=express(),
    http=require("http"),//引用http模块
    server=http.createServer(app);
server.listen(8888);
app.use(express.static('image'));//发布静态资源
