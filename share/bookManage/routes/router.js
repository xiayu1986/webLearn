var express = require('express');
var router = express.Router();
var fs=require("fs");
var bodyParser = require('body-parser');//调用JSON解析模块
var app = express();//创建应用
var jsonParser = bodyParser.json()//获取JSON解析器中间件
var urlencodedParser = bodyParser.urlencoded({ extended: false })//url-encoded解析器
router.get('/', function(req, res, next) {
  res.render('index', { title: '用户登录' });
});

router.post('/login',urlencodedParser, function(req, res, next) {
console.log(req.body)
  res.json({"message":"登录成功"})
});


module.exports = router;
