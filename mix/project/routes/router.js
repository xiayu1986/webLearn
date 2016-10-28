var express = require('express'),//引用express模块
    router = express.Router(),//引用路由模块
    bodyParser = require('body-parser'),//调用JSON解析模块
    mysql = require('mysql'),//引用数据库模块
    urlencodedParser = bodyParser.urlencoded({ extended: false }),//url-encoded解析器
    client = mysql.createConnection({//创建数据库对象
      user: 'root',
      password: ''
    }),
    dataBase = 'flightsSql',//要创建或连接的数据库
    dataTable = 'flightsTable';//要创建或查询的数据表

client.user = 'root';//数据库登录名
client.password = 'root';//数据库登录密码
client.connect();//创建数据库连接
client.query('CREATE DATABASE IF NOT EXISTS '+dataBase, function(err) {//如果要连接的目标数据库不存在，创建该数据库(容错处理)
    if (err) {
      console.log(err)
    }
});
client.query('USE '+dataBase);//查询数据库
client.query(
    'CREATE TABLE IF NOT EXISTS '+dataTable+//如果要查询的表不存在，创建该表(容错处理)
    '(id INT(11) AUTO_INCREMENT, '+ //ID
    'flightNumber VARCHAR(255), '+ //航班号
    'depPort VARCHAR(255), '+ //起飞机场
    'arrPort VARCHAR (255), ' + //到达机场
    'depTime VARCHAR (255), ' + //起飞时间
    'arrTime VARCHAR (255), ' + //到达时间
    'stop VARCHAR (255), ' + //经停
    'equipment TEXT (255), ' + //机型
    'cabin VARCHAR (255), ' + //舱位
    'flightTime VARCHAR (255), ' + //飞行时长
    'stopTime VARCHAR (255), ' + //停留时长
    'visa TEXT (255), ' + //签证
    'totalPrice VARCHAR (255), ' + //总价
    'ticketPrice VARCHAR (255), ' + //票价
    'taxFee VARCHAR (255), ' + //税费
    'ticketCount VARCHAR (255),'+  //票数
    'PRIMARY KEY (id))'
);

/*client.query("TRUNCATE "+dataTable);*/

/*for(var i=0;i<8000;i++){
    var insertData=[
        "CA10"+i,//航班号
        "PEK",//起飞机场
        "HKG",//到达机场
        "13:00",//起飞时间
        "16:25",//到达时间
        "0",//经停
        "33A",//机型
        "F",//舱位
        "3h25m",//飞行时长
        "0",//停留时长
        "visa",//签证
        "323"+i,//总价
        "311"+i,//票价
        "10"+i,//税费
        i//票数
    ]
   client.query("INSERT INTO "+dataTable+" SET flightNumber=?,depPort=?,arrPort=?,depTime=?,arrTime=?,stop=?,equipment=?,cabin=?,flightTime=?,stopTime=?,visa=?,totalPrice=?,ticketPrice=?,taxFee=?,ticketCount=?",insertData,function(err){//向数据表中插入数据

   });
 }*/

router.get('/', function(req, res, next) {//req：客户端请求信息，包含请求参数,res：服务器端响应，next：转让路由控制权
  res.render('index', { title: '航班查询(服务器渲染)' });
});

router.get('/load', function(req, res, next) {
    res.render('query', { title: '航班查询(本地渲染)' });
});

router.post('/query',urlencodedParser, function(req, res, next) {
    var reqType=req.body.type;
          var totalData=[];
          client.query('SELECT * FROM '+dataTable,//查询数据库
              function (err, results, fields) {//查询成功后的回调,err：错误信息，results：查询结果
                  if(err){
                      console.log(err);
                      return;
                  }
                  for(var i=0;i<results.length;i++){//遍历查询结果并将结果追加到数组中以便截取
                      totalData.push(results[i]);
                  }
                  var resultData={"data":totalData,"totalSize":totalData.length,"message":"查询成功！","status":1};//构造要返回给前端的数据
                  if(reqType=="html"){
                      var d1= new Date();
                      res.render("template",resultData);
                      var d2= new Date();
                      console.log("渲染耗时："+((d2-d1)/1000)+"秒");
                  }else if(reqType=="json"){
                      res.json(resultData)
                  }
              }
          )
});

module.exports = router;
