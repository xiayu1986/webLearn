/**
 * Created by Administrator on 2016/11/11.
 */

var exec=require("child_process").execFile;
var child=exec("scripts/reqServer.js")
console.log(child.stdout)