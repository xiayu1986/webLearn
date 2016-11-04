self.addEventListener("message",function(e){//监听主进程的消息
  var itemsArr=[];
  for(var i=0;i<100000;i++){
    itemsArr.push('<div class="items">'+(i+1)+'</div>')
  }
  self.postMessage(itemsArr);//向主进程发送处理结果
})