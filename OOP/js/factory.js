(function (w,d) {

	/*构造方法*/
	function _$(els){
		this.elements=[];
		for(var i=0,len=els.length;i<len;i++){
			var element=els[i];
			if(typeof element ==="string"){
				element=document.getElementById(element);
			}
			this.elements.push(element);
		}
	}
	/*原形方法*/
	_$.prototype={
		constructor:_$,
		each:function(callback){
			for(var i=0,len=this.elements.length;i<len;i++){
				callback.call(this,i,this.elements[i])
			}
			return this;
		},
		css:function(prop,value){
			this.each(function(i,el){
				el.style[prop]=value;
			})
			return this;
		},
		show:function(){
			var _this=this;
			this.each(function(i,el){
				_this.css("display","block");
			})
			return this;
		},
		hide:function(){
			var _this=this;
			this.each(function(i,el){
				_this.css("display","none");
			})
			return this;
		},
		bind:function(e,callback){
			var addEvent=function(el){
				if(window.addEventListener){
					el.addEventListener(e,callback,false)
				}else{
					el.attachEvent('on'+e,callback)
				}
			}
			this.each(function(i,el){
				addEvent(el)
			})
			return this;
		},
		unbind:function(e,callback){
			var removeEvent=function(el){
				if(window.removeEventListener){
					el.removeEventListener(e,callback,false);
				}else{
					el.detachEvent('on'+e,callback)
				}
			}
			this.each(function(i,el){
				removeEvent(el);
			})
			return this;
		}
	}

	/*暴露公共对象*/
	w.installer=function(scope,interface){
		scope[interface]=function(){
			return new _$(arguments);
		}
	}
})(window,document)