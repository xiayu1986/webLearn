/**
 * Created by Administrator on 2015/8/15.
 * 链表
 */
function node(elem){//创建节点
    this.element=elem;
    this.next=null;//后节点
    this.prev=null;//前节点
}
function linkList(){
    this.head=new node("head");
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
        newNode.prev=current;
        current.next=newNode;
    },
    display:function(){
        var current=this.head;
        while(current.next!=null){
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
            current.prev.next=current.next;
            current.next.prev=current.prev;
            current.next=null;
            current.prev=null;
        }
    },
    last:function(){
    	var current=this.head;
    	while(current.next!=null){
    		current=current.next
    	}
    	return current;
    },
    reverse:function(){
    	var current=this.head;
    	current=this.last();
    	if(current.prev!=null){
    		console.log(current.element);
    		current=current.prev;
    	}
    }
}