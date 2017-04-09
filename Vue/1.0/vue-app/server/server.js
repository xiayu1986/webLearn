var http=require("http"),
    server=http.createServer();
    server.on("request",function(req,res){
      res.writeHead(200,{"Content-type":"text/html","Access-Control-Allow-Origin":"*"});
      res.end("hello")
    })
server.listen(3000);