/**
 * Created by Administrator on 2015/8/15.
 * 队列
 */
function queue(){
    this.data=[];
}

queue.prototype={
    constructor:queue,
    enqueue:function(elem){
        this.data.push(elem)
    },
    dequeue:function(){
        return this.data.shift();
    },
    prodequeue:function(){
        var pro=this.data[0].code,num=0;
        for(var i=1;i<this.data.length;i++){
            if(this.data[i].code<pro){
                num=i;
            }
        }
        return this.data.splice(num,1);
    },
    front:function(){
        return this.data[0]
    },
    end:function(){
        return this.data[this.data.length-1]
    },
    showData:function(){
        var str="";
        for(var i=0;i<this.data.length;i++){
            str+=this.data[i]+"\n"
        }
        return str;
    },
    clear:function(){
        this.data.length=0;
        delete this.data;
        this.data=[];
    },
    empty:function(){
        if(this.data.length==0){
            return true;
        }else{
            return false;
        }
    }
}