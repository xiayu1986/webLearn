/**
 * Created by Administrator on 2016/10/23.
 */

/*创建客户端*/
var http=require("http");
var options={
    "port":8088,
    "host":"http://localhost",
    "path":"index.html"
}

var callback=function (response) {
    var body="";
    response.on("data",function (data) {
        body+=data
    })
    response.on("end",function () {
        console.log(body)
    })
}
var req=http.request(options,callback);
req.end();