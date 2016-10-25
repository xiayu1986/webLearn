/**
 * Created by Administrator on 2016/10/23.
 */
var http=require("http");
var router=require("./moduleRouter");

function start() {
    http.createServer(router.router).listen(8088)
}


exports.start=start;