/**
 * Created by Administrator on 2016/10/23.
 */
var http=require("http");
var express=require("express");
var app=express();
var server=http.createServer();
server.on("request",function (req,res) {
    res.writeHead(200,{"Content-Type":"text/html"});
    res.write('<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>服务页面</title></head><body>您好</body></html>');
    res.end();
});
server.listen(8090);