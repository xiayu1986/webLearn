/**
 * Created by Administrator on 2016/10/25.
 * 创建服务器
 */

var  http=require("http"),//引用http模块
    server=http.createServer();//创建服务器
server.listen(8088);//监听8088端口
server.on("request",function (req,res) {//监听客户端请求
    res.writeHead(200,{"Content-Type":"text/html"});//服务器端响应
    res.end('<!DOCTYPE html>\
        <html lang="en">\
        <head>\
        <meta charset="UTF-8">\
        <title>服务器运行中</title>\
        </head>\
        <body>\
        启动成功！\
        </body>\
        </html>')
})



