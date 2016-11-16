/**
 * Created by Administrator on 2015/8/15.
 * 栈的模拟
 */
function stack(){
    this.data=[];
    this.top=0;
}
stack.prototype={
    constructor:stack,
    push:function(elem){
        this.data[this.top++]=elem;
    },
    pop:function(){
        return this.data[--this.top]
    },
    peek:function(){
        return this.data[this.top-1]
    },
    size:function(){
        return this.top;
    },
    clear:function(){
        this.top=0;
        delete this.data;
        this.data=[];
    }
}

