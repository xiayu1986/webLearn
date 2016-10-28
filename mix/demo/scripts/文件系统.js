/**
 * Created by Administrator on 2016/10/23.
 */


var fs=require("fs");

/*-------------打开文件-------------*/
fs.open("../data/test.json","r+",function (err,data) {
    if(err){
        console.log(err);
        return;
    }
    console.log(data)
})

/*-------------获取文件信息-------------*/

fs.stat("../data/test.json",function (err,states) {
    console.log(states)
})

/*-------------读取文件-------------*/
var buf=new Buffer(1024);
fs.open("../data/test.json","r+",function (err,fd) {
    fs.read(fd,buf,0,buf.length,0,function (err,bytes,buffer) {
        console.log(buffer.toString());
        fs.close(fd,function (err,data) {
            console.log("文件关闭")
        })
    }) 
})

/*------------截取文件-------------*/
fs.open("../data/test.json","r+",function (err,data) {
    fs.ftruncate(data,10,function (error) {
        console.log("截取成功")
    })
})

/*------------删除文件-------------*/
fs.unlink("../data/build.rar",function (err) {
    if(err){
        console.log(err);
        return;
    }
    console.log("文件删除成功！")
})

/*------------创建目录-------------*/
fs.mkdir("../temp",function (err) {
    if(err){
        console.log(err);
        return;
    }
    console.log("创建目录成功！")
})

/*------------读取目录-------------*/
fs.readdir("../temp",function (err,files) {
    if(err){
        console.log(err);
        return;
    }
    files.forEach(function (file) {
        console.log(file)
    })
})