/**
 * Created by Administrator on 2015/8/9.
 */
;(function($,window,document,undefined){
	var defaults={//默认配置
		trigger:"click",//触发事件：click
		isEdit:true,//是否可输入
		beforeShow:function(){},//打开菜单前执行的方法 
		afterShow:function(){},//打开菜单后执行的方法
		beforeHide:function(){},//关闭菜单前执行的方法 
		afterHide:function(){},//关闭菜单后执行的方法 
		onSelect:function(){},//选择后触发的方法
		valueField:'code',//将code字段作为下拉选项的value值
		textField:'name',//指定将name字段作为下拉选项的显示值
		isMultiple:false,//是否可多选
		isValueSort:true,//选择结果是否支持排序
		formatTemplate:"1",//自定义下拉菜单风格
		dataSource:"",//指定数据源
		initFilter:false,///初始化时是否筛选
		param:function(data){//请求参数
			return {
				type:"POST",
				timeout:40000,
				data:{
					"keywords":""
				}
			}
		},
		loadData:{//从服务器加载数据

		},
		isRemoteFilter:false,//远程接口是否支持filter
		indentX:10,//下拉菜单图标与输入框右侧的距离
		separator:"|",//定义多选时写入到输入框的分隔符
		showOptions:false,//多选时是否显示操作项(全选、取消)
		baseNumber:10,//用以确定下拉菜单的最大高度也是每页显示的数据量
		scrollRate:1,//每次滚过的数量
		pagerType:"local",//分页类型:remote表示远程服务器加载分页,local表示本地分页,为空表示不分页
		formatData:function(data){//处理返回的数据格式
		}
	}
	var methods={
		init:function(options){
			return this.each(function(){
				var settings=$(this).data("WEB_selectMenu_settings");//用户配置
				if(settings){
					this.settings=$.extend(true,{},settings,options);
				}else{
					this.settings=$.extend(true,{},defaults,options);
					$(this).data("WEB_selectMenu_settings",this.settings);
				}
				methods._createSelectContainer.call(this);//创建容器
			})
		},
		_createSelectId:function () {//为每个select输入框生成随机ID
			if(!this.uid){
				this.uid="select"+Math.random()*10000000000;
				this.uid=this.uid.replace(/(.*)\..*/gi,'$1');
			}
		},
		_createSelectContainer:function(){//创建容器
			methods._createSelectId.call(this);//生成用于将当前输入框及三角标识联系起来的唯一ID
			methods._initSelectField.call(this);//初始化输入框
			methods._initSelectContainer.call(this);//初始化容器
			methods._createSelectIdent.call(this);//创建下拉标识
		},
		_initSelectField:function () {//初始化输入框
			$(this).addClass("WEB_select_field");
			if(!$(this).attr("selectId")){
				$(this).attr("selectId",this.uid);//为输入框添加Id
			}

			if(!this.settings.isEdit){//输入框是否只读
				$(this).prop("readonly",true)
			}else{
				$(this).removeAttr("readonly")
			}
		},
		_initSelectContainer:function(){//初始化容器
			var container=$("#WEB_selectMenu_container");
			if(container.length==0){
				container=$('<div class="WEB_selectMenu_container" id="WEB_selectMenu_container"></div>');
				container.appendTo($("body"));
			}
			container.css({"display":"none"});
			methods._createContainerEvent.call(this);//为容器绑定事件
		},
		_createContainerEvent:function(){//绑定事件
			var _this=this,ieVersion=navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion .split(";")[1].replace(/[ ]/g,""),
				eventType='input';//定义事件类型
			if(ieVersion=="MSIE8.0"){//兼容IE8
				eventType="mousedown keyup"
			}
			else if(ieVersion=="MSIE9.0"){//兼容IE9
				eventType="input keyup"
			}
			$(this).off(_this.settings.trigger)
					.on(_this.settings.trigger,function(e){//创建下拉菜单
						e.preventDefault();
						if(_this.settings.trigger!="focus" && _this.settings.trigger!="click"){
							$.error("该组件仅支持focus和click事件！");
							return;
						}
						e.stopPropagation();
						if(!$(this).hasClass('WEB_select_current')){//没有打开标识
							methods._openSelectMenu.call(this);//打开下拉菜单
						}else{
							methods._closeSelectMenu.call(this);//收起下拉菜单
						}
					})
					.on(eventType,function(e){
						if((e.type=="mousedown" && e.which==3)||e.type=="input"||e.type=="keyup"){//右键
							if(!$(this).hasClass('WEB_select_current')){
								methods._openSelectMenu.call(this);//打开下拉菜单
							}
						}
					})

			$(document).click(function(e){//点击任意空白处收起
				methods._closeSelectMenu.call(_this);
			})
			methods._bindSelectListEvent.call(this);//绑定下拉菜单上的事件
		},
		_createSelectIdent:function(){//创建下拉菜单标识
			var _this=this,$this=$(this);
			this.indent=$('<div class="WEB_selectIndent"></div>');
			this.indent.attr("targetId",_this.uid);

			if($(".WEB_selectIndent[targetid="+_this.uid+"]").length==0){
				this.indent.appendTo($("body"));
			}
			methods._setSelectIdentPosition.call(this);//设置下拉菜单标志符的位置

			this.indent.off("click").on("click",function (e) {
				if(!$this.hasClass('WEB_select_current')){
					methods._openSelectMenu.call(_this);//打开下拉菜单
				}else{
					methods._closeSelectMenu.call(_this);//收起下拉菜单
				}
				e.preventDefault();
				e.stopPropagation();
			})
			$(window).on("resize",function(){//视口大小改变时重置下拉菜单标志符的位置
				methods._setSelectIdentPosition.call(_this);
			})	
		},
		_setSelectIdentPosition:function(){//设置标识的位置
			var _this=this;
			$(".WEB_selectIndent").each(function () {
				var uid=$(this).attr("targetId"),selectDom=$("input[selectId="+uid+"]");
				if(selectDom.length>0){
					var X=selectDom.offset().left,
					Y=selectDom.offset().top,
					H=selectDom.outerHeight(),
					W=selectDom.outerWidth(),
					inW=$(this).outerWidth(),
					inH=$(this).outerHeight();
					$(this).css({"left":X+W-inW-_this.settings.indentX,"top":Y+(H-inH)/2});
				}	
			})
		},
		_openSelectMenu:function(){//打开下拉菜单
            if($.isFunction(this.settings.beforeShow)){
                this.settings.beforeShow.call(this);
            }
			var container=$("#WEB_selectMenu_container"),_this=this;
			container.off("mousewheel").css("display","block").html('<div class="WEB_selectMenu_loading"></div>');
			$(".WEB_select_current").removeClass('WEB_select_current');//移除当前输入框高亮
			$(this).addClass('WEB_select_current');//为当前输入框添加高亮
			$(".WEB_selectIndent_active").removeClass('WEB_selectIndent_active');//移除当前下拉菜单展开标志
			$(".WEB_selectIndent[targetid="+this.uid+"]").addClass('WEB_selectIndent_active');//为下拉添加展开标志
			methods._position.call(this);//设置下拉菜单位置
			methods._getSelectMenuData.call(this);//获取下拉菜单数据
			$(window).on("resize",function(){//可视区大小改变重置下拉菜单位置
				methods._position.call(_this);	
			})
		},
		_closeSelectMenu:function(){//关闭下拉菜单
            if(!$(this).hasClass("WEB_select_current")){
                return;
            }
            if($.isFunction(this.settings.beforeHide)){
                this.settings.beforeHide.call(this);
            }
			$("#WEB_selectMenu_container").html("").css({"display":"none"}).off("mousewheel");
			$(".WEB_selectIndent[targetid="+this.uid+"]").removeClass('WEB_selectIndent_active');
			$(this).removeClass('WEB_select_current');
            if($.isFunction(this.settings.afterHide)){
                this.settings.afterHide.call(this);
            }
			//methods._setSelectIdentPosition.call(this);//重新设置下拉菜单标志符的位置
		},
		_position:function(){//设置下拉菜单的位置
			var container=$("#WEB_selectMenu_container"),
				X=$(this).offset().left,
				Y=$(this).offset().top,
				H=$(this).outerHeight(),
				W=$(this).outerWidth()-2*parseInt(container.css("borderLeftWidth"))||0,
				BW=parseInt($(this).css("borderTopWidth"))||parseInt($(this).css("borderBottomWidth"))||0;
			container.css({"width":W,"left":X,"top":Y+H-BW});
			methods._setSelectIdentPosition.call(this);//设置小三角标志的位置
		},
		_getSelectMenuData:function(){//获取下拉菜单数据
			var _this=this,
				sourceData=this.settings.dataSource,
				arrRule=/\{.*\[\{.*\}\].*\}/gi,//匹配静态数据规则
				urlRule=/^((https|http)?:\/\/)[^\s]+/gi,//匹配URL规则
				container=$("#WEB_selectMenu_container");
			if(!sourceData){
				container.html('<div class="WEB_selectMenu_noResult">没有获取到数据！</div>');
				return;
			}
			if($.type(sourceData)==="string"){
				if(sourceData.charAt(0)=="#" || sourceData.charAt(0)=="."){//从ID或class的节点中获取数据
					sourceData=$(sourceData).val()||$(sourceData).html();
					sourceData=$.parseJSON(sourceData);
					methods._processData.call(_this,sourceData);//处理数据
				}
				else if(arrRule.test(sourceData)){//数组	
					sourceData=$.parseJSON(sourceData);
					methods._processData.call(_this,sourceData);//处理数据
				}else if(sourceData.indexOf("/")!=-1 && urlRule.test(sourceData)){//从服务器上取数据
					if(!container.is(":hidden")){
						methods._loadRemoteData.call(_this);//处理数据
					}
				}
			}else if($.isArray(sourceData)){
				methods._processData.call(_this,sourceData);//处理数据
			}
		},
		_loadRemoteData:function(){//获取远程数据
			var _this=this,container=$("#WEB_selectMenu_container"),param=this.settings.param();
			param.url=this.settings.dataSource;
			$.ajax(param)
			.done(function(res){
				if(res.data && res.data.length>0){//有数据返回
					methods._processData.call(_this,res);
				}else{
					container.html('<div class="WEB_select_noResult">没有获取到数据！</div>')
				}
			})
			.fail(function(xhr){
				var errMsg="错误码:"+xhr.status+"&nbsp;"+xhr.statusText;
				container.html('<div class="WEB_select_error">'+errMsg+'</div>')
			})
		},
		_processData:function(sourceData){//处理数据
			var totalData=this.settings.formatData(sourceData)||sourceData,_this=this;
			methods._localDataHandle.call(this,totalData);//本地处理数据
			if(!this.settings.isRemoteFilter){//如果远程接口不支持筛选,待处理
				var ieVersion=navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion .split(";")[1].replace(/[ ]/g,""),
					eventType=(ieVersion=="MSIE8.0"||ieVersion=="MSIE9.0")?'keyup.filter':'input.filter';//定义事件类型
				$(this).off(".filter").on(eventType,function (e) {
					methods._filterKeywords.call(_this,totalData);//关键字过滤
				})
			}
		},
		_localDataHandle:function(source){//过滤下拉菜单数据 data为所有数据集合 startInd为分页开始的数量
			if(source.totalSize>this.settings.baseNumber){//需要生成滚动条(也即需要分页)
				var firstPageArr=source.data.slice(0,9);//截取第一页的数据
				var doneData={"data":firstPageArr,"totalSize":source.totalSize};
				methods._createScroller.call(doneData,source);
			}else{//不需要生成滚动条 也即不需要分页，直接进入渲染状态
				methods._renderSelectMenu.call(this,source)
			}
            
		},
		_renderSelectMenu:function(incomeData){//渲染列表
			var container=$("#WEB_selectMenu_container"),sourceHtml="",
				sourceHtml=methods._createSelectTemplate.call(this,incomeData,true);
			container.html(sourceHtml);
            if($.isFunction(this.settings.afterShow)){
                this.settings.afterShow.call(this);
            }
			//methods._position.call(this);//设置下拉菜单位置
			methods._initSelectClass.call(this,incomeData);//初始化被选中的状态
			var baseH=container.find(".WEB_selectMenu_list:first").outerHeight(true),
				baseNumber=this.settings.baseNumber>10?10:this.settings.baseNumber,
				maxH=baseH*baseNumber;
			container.css("maxHeight",maxH);
		},
		_createSelectTemplate:function(source,isInit){//构建下拉菜单样式,第二个参数表示是否是第一次加载，true是，false不是
			var resultHtml='',_this=this,
				iconHtml='',
				sourceHtml='';
			if(this.settings.formatTemplate=="1"){//设置下拉样式
				iconHtml=""
			}else if(this.settings.formatTemplate=="2"){
				iconHtml=this.settings.isMultiple?'<span class="multipleIcon"></span>':'<span class="radioIcon"></span>';
			}
			$.each(source.data,function(i,d){
				sourceHtml+='<li class="WEB_selectMenu_list" title="'+d[_this.settings.textField]+'" code="'+d[_this.settings.valueField]+'">'+iconHtml+d[_this.settings.textField]+'</li>'
			})
			if(isInit){
				if(this.settings.showOptions && this.settings.isMultiple){
					resultHtml='<ul class="WEB_selectMenu">'+sourceHtml+'</ul><div class="WEB_selectMenu_options"><span class="select_btn select_all_items">全选</span><span class="select_btn select_close_items">关闭</span><span class="select_btn select_no_items">取消</span></div>';	
				}else{
					resultHtml='<ul class="WEB_selectMenu">'+sourceHtml+'</ul>';
				}
			}else{
				resultHtml=sourceHtml;
			}
			return resultHtml;
		},
		_bindSelectListEvent:function(){//为下拉菜单中的选项绑定点击事件
			var container=$("#WEB_selectMenu_container"),
				$this=$(this),
				_this=this;
			container.off("click").on("click",".WEB_selectMenu_list",function(e){
				if(_this.settings.isMultiple){//如果是多选
					e.stopPropagation();
					var s=$(this).hasClass('WEB_selectMenu_list_active');
					!s?$(this).addClass('WEB_selectMenu_list_active'):$(this).removeClass('WEB_selectMenu_list_active');
				}else{
                   $(this).addClass('WEB_selectMenu_list_active').siblings('.WEB_selectMenu_list').removeClass('WEB_selectMenu_list_active');
				}
				methods._setSelectedValue.call(_this,$this);//设置输入框的value
			}).on("click",".WEB_selectMenu_options",function(e){
				e.stopPropagation();
			}).on("click",".select_no_items",function(){//点击取消按钮
				methods._closeSelectMenu.call(_this);
				$this.val("").removeAttr("code title");
			}).on("click",".select_all_items",function(){//点击全选按钮
				methods._setSelectedValue.call(_this,$this);
			}).on("click",".select_close_items",function(){//点击关闭按钮
				methods._closeSelectMenu.call(_this);
			})
		},
		_initSelectClass:function(){//初始化选中状态
			var intStr=$(this).val(),_this=this,
				menuList=$("#WEB_selectMenu_container .WEB_selectMenu_list");
			var intValArr=intStr.split(this.settings.separator),selectedStr=intValArr[0];
			menuList.removeClass("WEB_selectMenu_list_active");
			if(_this.settings.isMultiple){//多选
				$.each(intValArr,function(index, el) {
					selectedStr=el;
					menuList.each(function () {
						var t=$(this).text();
						if(t.toLowerCase()==selectedStr.toLowerCase()){
							$(this).addClass("WEB_selectMenu_list_active");
						}
					})
				})
			}else{//单选
				menuList.each(function () {
					var t=$(this).text();
					if(t.toLowerCase()==selectedStr.toLowerCase()){
						$(this).addClass("WEB_selectMenu_list_active");
					}
				})
			}
		},
		_createScroller:function(firstPageData,totalData){//创建滚动条并设置样式,第一个参数是当前页的数据，第二个参数是总数据
			methods._renderSelectMenu.call(this,firstPageData);//先渲染出第一页的数据
			var webSelectScroller=$("#WEB_selectMenu_scroller"),
				container=$("#WEB_selectMenu_container"),
				t=0,//定义并初始化滚动条的位置
				r,
				h=0,//定义并初始化滚动条的最大高度
				H=parseInt(container.css("maxHeight"));//用于确定滚动条的最大高度
			if(webSelectScroller.length==0){
				webSelectScroller=$('<div class="WEB_selectMenu_scroller" id="WEB_selectMenu_scroller"><div class="scroller_slider"></div></div>');
				webSelectScroller.appendTo(container);
			}
			if(this.settings.isMultiple && this.settings.showOptions){//针对多选设置
				var optionsH=$("#WEB_selectMenu_container .WEB_selectMenu_options").outerHeight();
				h=(H-optionsH)*0.95;
				t=(H-optionsH-h)/2;
			}else{//针对单选设置 
				h=H*0.95;
				t=(H-h)/2;
			}
			var rate=this.settings.baseNumber/data.length,
				menuSlider=$("#WEB_selectMenu_scroller .scroller_slider"),
				sh=rate*h<=30?30:rate*h,
				l=(webSelectScroller.width()-menuSlider.width())/2;
			menuSlider.css({"height":sh,"top":0,"left":l});
			var baseR=(menuSlider.outerWidth()-webSelectScroller.outerWidth())/2;
			r=baseR==0?2:(baseR<0?-baseR:baseR);
			webSelectScroller.css({"height":h,"top":t,"right":r});
			webSelectScroller.on("click",".scroller_slider",function(e){
				e.stopPropagation();
			})
			methods._bindScrollEvent.call(this,totalData);//绑定滚动条的滚动事件
		},
		_bindScrollEvent:function(sourceData){//绑定滚动事件
			var _this=this,
				container=$("#WEB_selectMenu_container"),
        		menu=$("#WEB_selectMenu_container .WEB_selectMenu"),
				baseH=$("#WEB_selectMenu_container .WEB_selectMenu_list:first").outerHeight(true),
				slider=$("#WEB_selectMenu_scroller .scroller_slider"),//拖拽滚动条
				dragging = false,//拖拽状态
				iY,
				dY1=0,
				dY2=0,
				maxTop=slider.parent().height()-slider.height();//滚动条可以滑动的最大高度
		        slider.mousedown(function(e) {//鼠标按下时的方法
		            dragging = true;
		            iY = e.clientY - $(this).position().top;
		            this.setCapture && this.setCapture();
		            dY1=$(this).position().top;
		            return false;
		        })
		        $(document).mousemove(function(e) {//鼠标拖动时的方法
		            if (dragging) {
		            	dY2=slider.position().top;
		                var oY = e.clientY - iY;
		                if(oY<0){
		                   oY=0 
		                }else if(oY>maxTop){
		                    oY=maxTop
		                }
		                slider.css({"top":oY });
		                methods._scroller.call(_this,oY/maxTop,dY1-dY2,sourceData); 
		                return false;
		            }
		        })
		        $(document).mouseup(function(e) {//鼠标抬起时的方法
		            dragging = false;
		            e.cancelBubble = true;
		        })
		        //鼠标滚动
		        	container.off("mousewheel").on("mousewheel",function(e){
						e.preventDefault();
						var dir=e.deltaY,//滚动方向
							rate=dir*_this.settings.scrollRate*baseH,//每次滚动时的高度
							basePos=$("#WEB_selectMenu_container .WEB_selectMenu").position().top,
							maxH=0,
							scrollerRate;
						basePos+=rate;
						if(_this.settings.isMultiple && _this.settings.showOptions){//多选
							maxH=menu.height()-container.height()+$("#WEB_selectMenu_container .WEB_selectMenu_options").outerHeight();
						}else{//单选
							maxH=menu.height()-container.height();
						}
						if(dir<0){
							if(Math.abs(basePos)>=maxH){
								basePos=-maxH;
							}
						}else{
							if(basePos>=0){
								basePos=0;
							}
						}
						menu.css({"top":basePos});
						//联动滚动条
						scrollerRate=basePos/maxH;
						slider.css({"top":-maxTop*scrollerRate});
						methods._createPagination.call(_this,sourceData);//如果数据总量大于每页可显示的数量调用分页方法
					})	
		},
		_scroller:function(rate,scrollDir,sourceData){//滚动
			var scrollMaxDis=0,
				container=$("#WEB_selectMenu_container"),
        		menu=$("#WEB_selectMenu_container .WEB_selectMenu");
			if(this.settings.isMultiple && this.settings.showOptions){//多选
				scrollMaxDis=menu.height()-container.height()+$("#WEB_selectMenu_container .WEB_selectMenu_options").outerHeight();
			}else{//单选
				scrollMaxDis=menu.height()-container.height();
			}
			menu.css({"top":-rate*scrollMaxDis});
			if(scrollDir<0 && data.length>this.settings.baseNumber){
				methods._createPagination.call(this,sourceData);
			}
		},
		_filterKeywords:function(sourceData){//关键字过滤,sourceData指总数据
			var _this=this,filterData={},//定义搜索后的结果集
				inStr=$(this).val(),//获取当前输入框内的关键字
				filterData=methods._matchKeywords.call(this,inStr,sourceData);

			if(inStr=="" || (inStr!="" && inStr.indexOf(this.settings.separator)>-1) || filterData.totalSize==0){
				methods._localDataHandle.call(_this,sourceData);
			}else{
				$("#WEB_selectMenu_container").off("mousewheel");
				methods._localDataHandle.call(_this,filterData);
			}
			var codeArr=inStr.split(_this.settings.separator);
			$(this).attr({"code":codeArr,"title":inStr});
			if($.isFunction(this.settings.onSelect)){
				this.settings.onSelect.call(this,this.settings.isMultiple?codeArr:inStr)
			}
		},
		_createPagination:function(d){//创建分页
			var container=$("#WEB_selectMenu_container"),
				menu=$("#WEB_selectMenu_container .WEB_selectMenu"),
				items=$("#WEB_selectMenu_container .WEB_selectMenu_list"),
				loadedNum=items.length,//取当前已加载的选项用于确定已经加载到第几页
				curPage=Math.ceil(loadedNum/this.settings.baseNumber),//当前已加载的页数
				totalPage=Math.ceil(d.totalSize/this.settings.baseNumber);//总页数
			if(curPage==totalPage){//如果当前页数等于总页数则停止加载
				return;
			}
			var criticalDom=items.last(),//临界DOM,当它出现在可视区时立即加载下一页数据
				viewH=parseInt(container.css("maxHeight"))+Math.abs(parseInt(menu.css("top"))),//滚动过去的高度
				curH=criticalDom.position().top;//临界DOM跟离下拉菜单顶部的高度
				if(this.settings.showOptions){
					viewH=viewH-$("#WEB_selectMenu_container .WEB_selectMenu_options").outerHeight()
				}
			if(curH<=viewH){//临界DOM出现在可视区
				curPage=curPage+1;//加载第二页的数据
				var startIndex=(curPage-1)*this.settings.baseNumber,
					endPoint=(curPage-1)*this.settings.baseNumber+(this.settings.baseNumber-1),
					appendData=d.data.slice(startIndex,endPoint+1);
				methods._appendPagerItem.call(this,appendData);
			}
		},
		_appendPagerItem:function(data){
			var container=$("#WEB_selectMenu_container"),
				menu=$("#WEB_selectMenu_container .WEB_selectMenu");
				container.find(".WEB_selectMenu_list_wait").remove();
				container.append($('<div class="WEB_selectMenu_list_wait"></div>'));
				methods._setWaitIconPosition.call(this);//设置加载状态的样式
			var sourceHtml=methods._createSelectTemplate.call(this,data,false);
			menu.append(sourceHtml);
			setTimeout(function(){
				container.find(".WEB_selectMenu_list_wait").remove();
			},300)
			methods._initSelectClass.call(this);//初始化选中样式
		},
		_setSelectedValue:function(curObj){//设置选中的数据
			var container=$("#WEB_selectMenu_container"),
				valueArr=[],//存放选中的text值
				codeArr=[];//存放选中的code值
			curObj.val("").removeAttr("code title");
			var actives=container.find(".WEB_selectMenu_list_active");
			actives.each(function(){
				var t=$(this).text(),
					c=$(this).attr("code");
				if($.inArray(t,valueArr)<0){
					valueArr.push(t);
				}
				if($.inArray(c,codeArr)<0){
					codeArr.push(c);
				}
			})
			if(valueArr.length==0){
				methods._openSelectMenu.call(this);//重新渲染下拉菜单
			}
			if(this.settings.isValueSort){//调用排序方法
				valueArr=methods._sortSelectedValue(valueArr);
				codeArr=methods._sortSelectedValue(codeArr);
			}
			curObj.val(valueArr.join(this.settings.separator)).attr({"code":codeArr,"title":valueArr.join(this.settings.separator)});
            if($.isFunction(this.settings.onSelect)){
                this.settings.onSelect.call(this,this.settings.isMultiple?codeArr:codeArr.length==0?"":codeArr.toString())
            }
		},
		_sortSelectedValue:function(arr){//排序
			var numberArr=[],//用于存储纯数字
				charArr=[];//用于存储非数字的所有其他字符
			$.each(arr,function(i,d){
				if($.isNumeric(d)){
					numberArr.push(d);
				}else{
					charArr.push(d);
				}
			})
			if(numberArr.length>0){
				numberArr= numberArr.sort(function(a,b){return a-b});
			}
			charArr=charArr.sort(function(a,b){return a.charAt(0).localeCompare(b.charAt(0))});
			return charArr.concat(numberArr);
		},
		_setWaitIconPosition:function(){//设置加载中状态的位置
			var container=$("#WEB_selectMenu_container"),
				wait=$(".WEB_selectMenu_list_wait"),
				CW=container.width(),
				CH=container.height(),
				ww=wait.width(),
				wh=wait.height(),
				l=(CW-ww)/2,
				t=(CH-wh)/2;
			wait.css({"left":l,"top":t});
		},
		_matchKeywords:function (targetStr,data) {//匹配要搜索的关键字
			var filterDataArr=[];
			var d1=Date.now();
			$.each(data,function(i,D){
				var Name=""+D.name;
				Name=Name.toLowerCase();
				targetStr=$.trim(targetStr.toLowerCase());
				var testRule=new RegExp('^'+targetStr,'gi');
				if(testRule.test(Name)){
					filterDataArr.push(D);
				}
			})
			var d2=Date.now();
			console.log("筛选用时："+(d2-d1)/1000+"秒");
			return {"data":filterDataArr,"totalSize":filterDataArr.length};
		}
	}
    
    $.fn.WEB_selectMenu=function(){
		var ieVersion=navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion .split(";")[1].replace(/[ ]/g,"");
		if(ieVersion=="MSIE7.0" || ieVersion=="MSIE6.0"|| ieVersion=="MSIE5.0"){
			alert("您的浏览器版本过低，本插件无法提供支持，请升级！");
			return;
		}
		var method=arguments[0],ARG;
		if(methods[method] && method.charAt(0)!="_"){
		    method=methods[method];
		    ARG=Array.prototype.slice.call(arguments,1);
		}else if(typeof method ==="object" || !method){
		    method=methods.init;
		    ARG=arguments;
		}else{
		    $.error("方法未正确调用");
		    return this;
		}
		return method.apply(this,ARG);
    }
})(jQuery,window,document);
