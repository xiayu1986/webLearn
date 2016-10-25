/**
 * Created by Administrator on 2016/10/25.
 * 阻塞与非阻塞
 */

var fs=require("fs");//引用文件模块

/*文件读取：阻塞方式*/

var novel=fs.readFileSync("data/novel.txt");//同步读取文件
var buf=new Buffer(novel);//创建缓冲区
console.log(buf.toString());//将读取结果转换成string输出


/*文件读取：非阻塞方式*/

fs.readFile("data/novel.txt",function (err,novel) {//异步读取文件，
    if(err){
        console.log(err);
        return;
    }
    console.log("文件读取成功！");
    var buf=new Buffer(novel);
    console.log(buf.toString());
})
console.log("文件读取结束！");