/**
 * Created by Administrator on 2015/8/15.
 *循环链表
 */
function node(elem){//创建节点
    this.element=elem;
    this.next=null;//后节点
}
function linkList(){
    this.head=new node("head");
    this.head.next=this.head;
}
linkList.prototype={
    constructor:linkList,
    find:function(elem){
        var curNode=this.head;
        while(curNode.element!=elem){
            curNode=curNode.next;
        }
        return curNode;
    },
    insert:function(newItem,item){
        var newNode=new node(newItem);
        var current=this.find(item);
        newNode.next=current.next;
        current.next=newNode;
    },
    display:function(){
        var current=this.head;
        while(current.next!=null && current.next.element!="head"){
            console.log(current.next.element);
            current=current.next;
        }
    },
    findPrev:function(item){
        var current=this.head;
        while(current.next!=null && current.next.element!=item){
            current=current.next;
        }
        return current;
    },
    remove:function(item){
        var current=this.find(item);
        if(current.next!=null){
            current.next=null;
        }
    }
}