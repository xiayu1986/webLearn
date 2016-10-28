/**
 * Created by Administrator on 2016/10/25.
 * 定义路由模块
 */
var url=require("url");
var qs=require("querystring");
function Router(req,res){
    var reqUrl=url.parse(req.url),pathname=reqUrl.pathname;
    res.writeHead(200,{"Content-Type":"text/html"});
    if(pathname=="/"){
        res.end('<!DOCTYPE html><html lang="en"> <head> <meta charset="UTF-8"><title>首页</title></head> <body>首页</body> </html>');
    }else if(pathname=="/login"){
        res.end('<!DOCTYPE html><html lang="en"> <head> <meta charset="UTF-8"><title>用户登录</title></head> <body>用户登录页</body> </html>');
    }else if(pathname=="/register"){
        res.end('<!DOCTYPE html><html lang="en"> <head> <meta charset="UTF-8"><title>用户注册</title></head> <body>用户注册页</body> </html>');
    }
}
module.exports=Router;