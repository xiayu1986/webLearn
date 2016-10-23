var http=require("http");//引用http模块，创建服务器
var url=require("url");//引用url模块，解析客户端请求地址
var qs=require("querystring");//引用querystring，解析客户端请求参数
var mysql = require('mysql');//引用mysql模块，连接、查询数据库
var server=http.createServer();//创建服务器

var client = mysql.createConnection({//创建数据库对象
    user: 'root',
    password: ''
});

var TEST_DATABASE = 'testSql',//要创建的数据库名
    TEST_TABLE = 'test';//要创建的表名


client.user = 'root';//数据库登录名
client.password = 'root';//数据库登录密码

client.connect();//创建连接

client.query('CREATE DATABASE IF NOT EXISTS '+TEST_DATABASE, function(err) {//如果要连接的目标数据库不存在则创建该数据库
    if (err && err.number != client.ERROR_DB_CREATE_EXISTS) {
        throw err;
    }
});

var table=client.query('USE '+TEST_DATABASE);//查询表
client.query(
'CREATE TABLE IF NOT EXISTS '+TEST_TABLE+//如果表不存在则创建该表
'(id INT(11) AUTO_INCREMENT, '+
'title VARCHAR(255), '+
'text TEXT, '+
'PRIMARY KEY (id))'
);

//client.query("TRUNCATE "+TEST_TABLE);
/*for(var i=0;i<100;i++){
    client.query("INSERT INTO "+TEST_TABLE+" SET title=?,text=?",["admin","MU"+i],function(err){//向数据表中插入数据

    });
}*/

server.on("request",function (req,res) {//监听客户端的请求
    var reqUrl=url.parse(req.url),//解析客户端请求URL
        param="";
    req.on("data",function (chunk) {//监听客户端请求参数
        param+=chunk;
    })
    req.on("end",function () {//客户端请求结束接收参数
        param=qs.parse(param);//使用querystring实例解析参数
        res.writeHead(200,{"Content-type":"application/json","Access-Control-Allow-Origin":"*"});//输出标准头，并允许跨域请求
        if(reqUrl.pathname=="/listData" && req.method=="POST"){//仅允许POST请求
            var totalData=[],//数据总量
                sliceData=[],//截取数据以满足分页需求
                start=0,//从第几条开始
                end=9;//到第几条结束
            var sql="";
            if(param.page){//判断是否有分页参数
                start=(param.page-1)*param.pageSize;//从第几条开始
                end=param.page*param.pageSize-1;//到第几条结束
            }
            if(param.keywords){//判断是否有关键字过滤
                var key=param.keywords;
                sql= ' WHERE "text" LIKE "%'+key+'%" ';
            }
            client.query('SELECT * FROM '+TEST_TABLE+sql,//查询数据库
                function (err, results, fields) {//查询成功后的回调,err：错误信息，results：查询结果
                    if(err){
                        console.log(err);
                        return;
                    }

                    for(var i=0;i<results.length;i++){//遍历查询结果并将结果追加到数组中以便截取
                        totalData.push(results[i]);
                    }

                    sliceData=totalData.slice(start,end+1);//按照start end截取数据
                    var resultData={"data":sliceData,"totalSize":totalData.length};//构造要返回给前端的数据
                    res.end(JSON.stringify(resultData));//返回数据，响应前端请求
                    //client.end();//清除数据库连接实例
                }
            );
        }
    })
})
server.listen(8090)
