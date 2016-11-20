/**
 * Created by Administrator on 2015/5/6.
 */
var m=angular.module("m",[]);
m.provider("floatService",function () {
    return {
        $get:function () {
            return {
                createFloat:function (num) {
                    return num.toFixed(2)
                }
            }
        }
    }
})