/**
 * Created by Administrator on 2016/10/23.
 */

console.log(__filename);//filename表示当前正在执行的文件名

console.log(__dirname);//dirname表示当前执行的脚本所在的目录

console.log(process);

process.on("exit",function (code) {
    console.log(code)
})

process.stdout.write("hello world"+"\n")