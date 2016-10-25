/**
 * Created by Administrator on 2016/10/23.
 */
var url=require("url");
var qs=require("querystring");
function router(req,res) {
    var pathName=url.parse(req.url).pathname;
    res.writeHead(200,{"Content-Type":"text/html"});
    if(pathName=="/"){
        res.write('<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>首页</title></head><body>访问首页</body></html>');
    }else if(pathName=="/login"){
        res.write('<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>用户登录</title></head><body>访问用户登录页</body></html>');
    }else if(pathName=="/manage"){
        res.write('<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>用户管理</title></head><body>访问用户管理页</body></html>');
    }
    res.end();
}
exports.router=router;