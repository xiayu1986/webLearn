/**
 * Created by Administrator on 2016/10/23.
 */

/*-----------创建buffer类-----------*/
var buf=new Buffer(10);
var bufArr=new Buffer([100,200,300]);
var bufStr=new Buffer("你好","utf-8"); //utf-8 是默认的编码方式，此外它同样支持以下编码："ascii", "utf8", "utf16le", "ucs2", "base64" 和 "hex"。


/*-----------写入缓冲区-----------*/

var buf=new Buffer(256);
var len=buf.write("http://www.hao123.com");
console.log("写入字节数 ："+len)

/*-----------从缓冲区读取数据-----------*/
console.log(buf.toString())

var buf=new Buffer(26);
for(var i=0;i<26;i++){
    buf[i]=i+97;
}
console.log(buf.toString("ascii"));
console.log(buf.toString("ascii",0,5));
console.log(buf.toString("utf8",0,5));
console.log(buf.toString(undefined,0,5));

var buf=new Buffer("www.imooc.com");
console.log(buf.toJSON());

/*-----------缓冲区合并-----------*/
var buf1=new Buffer("百度");
var buf2=new Buffer("新浪");
var buf3=Buffer.concat([buf1,buf2]);
console.log(buf3.toString());

/*-----------缓冲区比较-----------*/
console.log(buf1.compare(buf2));

/*-----------缓冲区copy-----------*/
var buf1=new Buffer("ABC");
var buf2=new Buffer(1);
buf1.copy(buf2)
console.log(buf2.toString())

console.log(buf2.slice(0,2).toString())

var buf=new Buffer("携程")
console.log(buf.length)