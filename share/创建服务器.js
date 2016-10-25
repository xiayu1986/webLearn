/**
 * Created by Administrator on 2016/10/25.
 * 创建服务器
 */

var  http=require("http"),
    server=http.createServer();
server.listen(8088);
server.on("request",function (req,res) {
    res.writeHead(200,{"Content-Type":"text/html"});
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



