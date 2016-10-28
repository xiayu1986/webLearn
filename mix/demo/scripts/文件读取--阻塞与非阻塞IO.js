/**
 * Created by Administrator on 2016/10/25.
 * 阻塞与非阻塞
 */

var fs=require("fs");//引用文件模块

/*文件读取：阻塞方式*/

/*var novel=fs.readFileSync("../data/page.json");//同步读取文件
console.log(novel.toString());//将读取结果转换成string输出
console.log("文件读取完成！")*/


/*文件读取：非阻塞方式*/

fs.readFile("../data/page.json",function (err,data) {//异步读取文件，
    if(err){
        console.log(err);
        return;
    }
    console.log("文件读取成功！");
    console.log(data.toString());
})
console.log("文件读取结束！");
