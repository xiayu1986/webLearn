/**
 * Created by Administrator on 2016/10/23.
 */
/*---------从流中读取数据---------*/
var fs=require("fs");
var data="";

//创建可读流
var readStream=fs.createReadStream("../jade/data.json");
readStream.setEncoding("UTF8");

readStream.on("data",function (chunk) {
    data+=chunk;
})
readStream.on("end",function () {
    console.log(data)
})
readStream.on("error",function (err) {
    console.log(err.stack)
})
console.log("程序执行完毕")

/*---------写入流---------*/

var data='{"text":"流年不利"}';

var writeStream=fs.createWriteStream("../data/test.json");//创建可写流

writeStream.write(data,"UTF8");//使用UTF8写入数据

writeStream.end();//标记文件末尾

writeStream.on("finish",function () {
    console.log("写入完成")
})

writeStream.on("error",function (err) {
    console.log("err.stack")
})

console.log("写入完毕");

/*---------管道流---------*/

var readStream=fs.createReadStream("../data/test.json");//创建可读流
var writeStream=fs.createWriteStream("../data/new.json");//创建可写流
readStream.pipe(writeStream);//读取可读流写入可写流

/*---------链式流---------*/
var zlib=require("zlib");
fs.createReadStream("../data/zlib.tar.gz").pipe(zlib.createGunzip()).pipe(fs.createWriteStream("../data/build.json"));
console.log("文件解压完成")