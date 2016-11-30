/**
 * Created by Administrator on 2015/8/9.
 */
;(function($,window,document,undefined){
	$.support.cors = true;
	var defaults={//默认配置
		trigger:"click",//触发事件：click
		isEdit:true,//是否可输入
		container:$("body"),
		disabledScrollDom:$(window),
		isScrollClose:false,
		isCreateIndent:true,//是否创建下拉菜单标识
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
		isBeginWithKeywords:false,//匹配时是否以输入的关键字开头
		param:function(data){//请求参数
			return {
				type:"POST",
				timeout:40000,
				data:{
					"keywords":""
				}
			}
		},
		isRemoteFilter:false,//是否支持线上筛选
		isRemotePager:false,//是否支持线上分页
		indentX:10,//下拉菜单图标与输入框右侧的距离
		separator:"|",//定义多选时写入到输入框的分隔符
		baseNumber:10,//用以确定下拉菜单的最大高度也是每页显示的数据量
		scrollRate:10,//每次滚过的数量
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
			if(this.settings.isCreateIndent){
				methods._createSelectIcon.call(this);//创建下拉标识
			}

			if(this.settings.isRemoteFilter){//从远程服务器筛选数据
				var _this=this;
				var ieVersion=navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion .split(";")[1].replace(/[ ]/g,""),
					eventType=(ieVersion=="MSIE8.0"||ieVersion=="MSIE9.0")?'keyup.filter':'input.filter';//定义事件类型
				$(this).off(".filter").on(eventType,function (e) {
					methods._remoteFilterKeywords.call(_this)//筛选数据
				})
			}
			
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
							methods._openSelectMenu.call(_this);//打开下拉菜单
						}else{
							methods._closeSelectMenu.call(_this);//收起下拉菜单
						}
					})
					.on(eventType,function(e){
						if((e.type=="mousedown" && e.which==3)||e.type=="input"||e.type=="keyup"){//右键
							if(!$(this).hasClass('WEB_select_current')){
								methods._openSelectMenu.call(_this);//打开下拉菜单
							}
						}
					})
			$(document).click(function(e){//点击任意空白处收起
				methods._closeSelectMenu.call(_this);
			})
			if(this.settings.isScrollClose){//滚动容器时收起下拉菜单
				containerDOM.on("scroll",function(){
					methods._closeSelectMenu.call(_this);
				})
			}
		},
		_createSelectIcon:function(){//创建下拉菜单标识
			var _this=this,$this=$(this);
			this.indent=$('<div class="WEB_selectIndent"></div>');
			this.indent.attr("targetId",_this.uid);

			if($(".WEB_selectIndent[targetId="+_this.uid+"]").length==0){
				this.indent.appendTo(this.settings.container||$("body"));
			}
			methods.setSelectIconPosition.call(this);//设置下拉菜单标志符的位置

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
				methods.setSelectIconPosition.call(_this);
			})
		},
		setSelectIconPosition:function(){//设置标识的位置
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
			$(".WEB_selectIndent[targetId="+this.uid+"]").addClass('WEB_selectIndent_active');//为下拉添加展开标志
			methods._position.call(this);//设置下拉菜单位置
			methods._getSelectMenuData.call(this);//获取下拉菜单数据
			$(window).on("resize",function(){//可视区大小改变重置下拉菜单位置
				methods._position.call(_this);	
			})
			methods._bindSelectListEvent.call(this);//绑定下拉菜单上的事件
		},
		_closeSelectMenu:function(){//关闭下拉菜单
            if(!$(this).hasClass("WEB_select_current")){
                return;
            }
            $(this).removeProp("disabled");//启用输入框
            methods._unLockScroll(this.settings.disabledScrollDom[0]);
            if($.isFunction(this.settings.beforeHide)){
                this.settings.beforeHide.call(this);
            }
			$("#WEB_selectMenu_container").html("").css({"display":"none"}).off("mousewheel");
			$(".WEB_selectIndent[targetId="+this.uid+"]").removeClass('WEB_selectIndent_active');
			$(this).removeClass('WEB_select_current');
            if($.isFunction(this.settings.afterHide)){
                this.settings.afterHide.call(this);
            }
		},
		_position:function(){//设置下拉菜单的位置
			var container=$("#WEB_selectMenu_container"),
				X=$(this).offset().left,
				Y=$(this).offset().top,
				H=$(this).outerHeight(),
				W=$(this).outerWidth()-(2*parseInt(container.css("borderLeftWidth"))||0),
				BW=parseInt($(this).css("borderTopWidth"))||parseInt($(this).css("borderBottomWidth"))||0;
			container.css({"width":W,"left":X,"top":Y+H-BW});
			methods.setSelectIconPosition.call(this);//设置小三角标志的位置
		},
		_getSelectMenuData:function(){//获取下拉菜单数据
			var _this=this,
				sourceData=this.settings.dataSource,
				arrRule=/\{.*\[\{.*\}\].*\}/gi,//匹配静态数据规则
				urlRule=/^((https|http)?:\/\/)[^\s]+/gi,//匹配URL规则
				container=$("#WEB_selectMenu_container");
			if(!sourceData){
				container.html('<div class="WEB_select_noResult">没有获取到数据！</div>');
				return;
			}
			if($.type(sourceData)==="string"){
				if(sourceData.charAt(0)=="#" || sourceData.charAt(0)=="."){//从ID或class的节点中获取数据
					sourceData=$(sourceData).val()||$(sourceData).html();
					sourceData=$.parseJSON(sourceData);
					methods._processData.call(_this,sourceData);//处理数据
				}else if(arrRule.test(sourceData)){//数组	
					sourceData=$.parseJSON(sourceData);
					methods._processData.call(_this,sourceData);//处理数据
				}else if(sourceData.indexOf("/")!=-1 || urlRule.test(sourceData)){//从服务器上取数据
					if(!container.is(":hidden")){
						var pageKey;
						if(_this.settings.isRemotePager===true){//线上分页加载前N条数据
							var pageKey={"page":1,"pageSize":_this.settings.baseNumber}
						}
						methods._loadRemoteData.call(_this,pageKey);//加载数据
					}
				}
			}else if($.isArray(sourceData)){
				methods._processData.call(_this,sourceData);//处理数据
			}
		},
		_loadRemoteData:function(key){//获取远程数据,key为关键字或者页码,key值存在且是字符串类型表示是按关键字过滤，是数字类型表示是分页，不存在表示是加载全部数据
			var _this=this,
				container=$("#WEB_selectMenu_container"),
				slider=$("#WEB_selectMenu_scroll .scroll_slider"),
				param=this.settings.param(key);
			param.url=this.settings.dataSource;
			if(key && key.page){//分页
				var waitDom=container.find(".WEB_selectMenu_list_wait");
				if(waitDom.length==0){
					container.append($('<div class="WEB_selectMenu_list_wait"></div>'));
					methods._setWaitIconPosition.call(this);//设置加载状态的样式
				}
			}
			$.ajax(param)
			.done(function(res){
				if(res.data && res.data.length>0){//有数据返回
					if(!_this.settings.isRemotePager||!_this.settings.isRemoteFilter){//本地分页或关键过滤
						methods._processData.call(_this,res);
					}else{//服务器分页或关键字过滤
						var totalData=_this.settings.formatData(res)||res;
						methods._localDataHandle.call(_this,totalData);//本地处理数据
					}
				}else{
					var msg="没有获取到数据！";
					container.html('<div class="WEB_select_noResult">'+msg+'</div>');
					slider.on("mousewheel",{"sourceContext":_this},methods._mouseWheelScroll);
				}
			})
			.fail(function(xhr){
				var errMsg="错误码:"+xhr.status+"&nbsp;"+xhr.statusText;
				container.html('<div class="WEB_select_error">'+errMsg+'</div>');
				slider.on("mousewheel",{"sourceContext":_this},methods._mouseWheelScroll);
			})
		},
		_processData:function(sourceData){//处理数据
			var totalData=this.settings.formatData(sourceData)||sourceData,_this=this;
			methods._localDataHandle.call(this,totalData);//本地处理数据
			if(!this.settings.isRemoteFilter){//本地筛选
				var ieVersion=navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion .split(";")[1].replace(/[ ]/g,""),
					eventType=(ieVersion=="MSIE8.0"||ieVersion=="MSIE9.0")?'keyup.filter':'input.filter';//定义事件类型
				$(this).off(".filter").on(eventType,function (e) {
					e.preventDefault();
					methods._localFilterKeywords.call(_this,totalData);//关键字过滤
				})
			}
		},
		_localDataHandle:function(source,isFilter){//过滤下拉菜单数据 source为所有数据集合
			if(!$(this).hasClass("WEB_select_current")){
				return;
			}
			var container=$("#WEB_selectMenu_container");
			if(source.totalSize>this.settings.baseNumber){//需要生成滚动条(也即需要分页)
				var itemLen=$("#WEB_selectMenu_container .WEB_selectMenu_list").length;
				if(itemLen==0){//itemLen为0表示要加载第一页的数据
					var incomeData=source;//远程分页时第一页数据
					if(!this.settings.isRemotePager){//本地分页时第一页的数据
						var firstPageArr=source.data.slice(0,10);
						incomeData={"data":firstPageArr,"totalSize":source.totalSize};
					}
					methods._renderSelectMenu.call(this,incomeData);
				}else{//表示已经加载完第一页
					
					if(this.settings.isRemotePager){//线上分页
						methods._appendPagerItem.call(this,source);
						container.on("mousewheel",{"sourceContext":this,"source":source},methods._mouseWheelScroll);
						methods._resetSliderPos.call(this);
					}else{
						if(arguments.length>1 && arguments[1]){//表示过滤
							var firstPageArr=source.data.slice(0,10),
								incomeData={"data":firstPageArr,"totalSize":source.totalSize};
							methods._renderSelectMenu.call(this,incomeData);
						}
					}
				}
				methods._createScroll.call(this,source);
			}else{//不需要生成滚动条 也即不需要分页，直接进入渲染
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
			var container=$("#WEB_selectMenu_container"),_this=this;
			container.off("click").on("click",".WEB_selectMenu_list",function(e){
				var curItem=$(this);
				if(_this.settings.isMultiple){//如果是多选
					e.stopPropagation();
					var s=$(this).hasClass('WEB_selectMenu_list_active');
					!s?$(this).addClass('WEB_selectMenu_list_active'):$(this).removeClass('WEB_selectMenu_list_active');
				}else{
                   $(this).addClass('WEB_selectMenu_list_active').siblings('.WEB_selectMenu_list').removeClass('WEB_selectMenu_list_active');
				}
				methods._setSelectedValue.call(_this,curItem);//设置输入框的value
			})

			container.on("mouseenter",function(){
				methods._lockScroll(_this.settings.disabledScrollDom[0]);
			}).on("mouseleave",function(){
				methods._unLockScroll(_this.settings.disabledScrollDom[0]);
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
		_createScroll:function(totalData){//创建滚动条并设置样式,第一个参数是当前页的数据，第二个参数是总数据
			var webSelectScroll=$("#WEB_selectMenu_scroll"),
				container=$("#WEB_selectMenu_container"),
				t=0,//定义并初始化滚动条的位置
				r,
				h=0,//定义并初始化滚动条的最大高度
				H=parseInt(container.css("maxHeight"));//用于确定滚动条的最大高度

			if(webSelectScroll.length>0){
				return;
			}
			webSelectScroll=$('<div class="WEB_selectMenu_scroll" id="WEB_selectMenu_scroll"><div class="scroll_slider"></div></div>');
			webSelectScroll.appendTo(container);
			h=H*0.95;
			t=(H-h)/2;
			var rate=this.settings.baseNumber/totalData.totalSize,
				menuSlider=$("#WEB_selectMenu_scroll .scroll_slider"),
				sh=rate*h<=30?30:rate*h,
				l=(webSelectScroll.width()-menuSlider.width())/2;
			menuSlider.css({"height":sh,"top":0,"left":l});
			var baseR=(menuSlider.outerWidth()-webSelectScroll.outerWidth())/2;
			r=baseR==0?2:(baseR<0?-baseR:baseR);
			webSelectScroll.css({"height":h,"top":t,"right":r});

			webSelectScroll.on("click",".scroll_slider",function(e){
				e.stopPropagation();
			})
			methods._bindScrollEvent.call(this,totalData);//绑定滚动条的滚动事件
		},
		_bindScrollEvent:function(sourceData){//绑定滚动事件
			var _this=this,
				container=$("#WEB_selectMenu_container"),
				clientH=parseInt(container.css("maxHeight")),
        		menu=$("#WEB_selectMenu_container .WEB_selectMenu"),
				slider=$("#WEB_selectMenu_scroll .scroll_slider"),//滑块
				dragging = false,//拖拽状态
				iY,
				dY1=dY2=0,
				maxTop=slider.parent().height()-slider.height();//滚动条可以滑动的最大高度
		        slider.off("mousedown").on("mousedown",function(e) {//鼠标按下时的方法
		            dragging = true;
		            iY = e.clientY - $(this).position().top;
		            this.setCapture && this.setCapture();
		            dY1=$(this).position().top;
		            return false;
		        })
		        $(document).mousemove(function(e) {//鼠标拖动时的方法
		            if (dragging) {
		                var oY = e.clientY - iY;
		                if(oY<0){
		                   oY=0 
		                }else if(oY>maxTop){
		                    oY=maxTop
		                }
		                slider.css({"top":oY});
		                var menuH=menu.height(),
		                	loadedItems=menu.find(".WEB_selectMenu_list");
	                	if(loadedItems.length===sourceData.totalSize){
	                		menuH-=clientH;
	                	}
	                	menu.css({"top":-(oY/maxTop)*menuH});
		                return false;
		            }
		        })
				slider.mouseup(function(e) {//鼠标抬起时的方法
		            dragging = false;
		            e.cancelBubble = true;
		            dY2=slider.position().top;
		            var loadedItems=menu.find(".WEB_selectMenu_list").length;//取当前已加载的数量
				    if(loadedItems===sourceData.totalSize || dY2<=dY1){//所有数据加载完成
						return;
					}
					methods._createPagination.call(_this,sourceData);
		        })
		        //鼠标滚动
				container.off("mousewheel").on("mousewheel",{"source":sourceData,"sourceContext":_this},methods._mouseWheelScroll);
		},
		_mouseWheelScroll:function (e) {//鼠标滚动事件调用方法
			e.preventDefault();
			var _this=e.data.sourceContext,
				container=$("#WEB_selectMenu_container"),//当前容器
				menu=$("#WEB_selectMenu_container .WEB_selectMenu"),//列表
				clientH=parseInt(container.css("maxHeight")),//可视区高度
				slider=$("#WEB_selectMenu_scroll .scroll_slider"),//滑块
				menuH=menu.height(),//当前列表的高度
				curItemsLen=menu.find(".WEB_selectMenu_list").length,//当前列表已加载的数量
				maxTop=slider.parent().height()-slider.height(),//滑块可以滑动的最大高度
				dir=e.deltaY,//滚动方向
				rate=dir*_this.settings.scrollRate,//每次滚动时的高度
				basePos=menu.position().top,
				scrollRate=0;//滚动占比
			basePos+=rate;//递增列表的位置
			if(e.data.source && curItemsLen==e.data.source.totalSize){
				menuH-=clientH
			}
			if(dir<0){
				if(Math.abs(basePos)>menuH){
					basePos=-menuH;
				}
			}else{
				if(basePos>=0){
					basePos=0;
				}
			}
			menu.css({"top":basePos});
			//联动滚动条
			scrollRate=basePos/menuH;
			slider.css({"top":-maxTop*scrollRate});
			if(e.data.source && curItemsLen==e.data.source.totalSize){
				return;
			}
			methods._createPagination.call(_this,e.data.source);//如果数据总量大于每页可显示的数量调用分页方法
		},
		_localFilterKeywords:function(sourceData){//关键字过滤,sourceData指总数据
			var _this=this,filterData={},//定义搜索后的结果集
				inStr=$(this).val();//获取当前输入框内的关键字
				var fP={"keywords":inStr}
				this.settings.param(fP);
			if(inStr=="" || (inStr!="" && inStr.indexOf(this.settings.separator)>-1)){
				methods._localDataHandle.call(_this,sourceData,true);
			}else{
				$("#WEB_selectMenu_container").off("mousewheel");
				var filterData=methods._matchKeywords.call(this,inStr,sourceData);
				if(filterData.data.length==0){
					$("#WEB_selectMenu_container").html('<div class="WEB_select_noResult">没有搜索到数据！</div>');
				}else{
					methods._localDataHandle.call(_this,filterData,true);
				}
				
			}
			var codeArr=inStr.split(_this.settings.separator);
			$(this).attr({"code":codeArr,"title":inStr});
			if($.isFunction(this.settings.onSelect)){
				this.settings.onSelect.call(this,codeArr,codeArr);
			}
		},
		_remoteFilterKeywords:function(){//关键字过滤,从服务器查询数据
			var inStr=$(this).val();//获取当前输入框内的关键字
				if(inStr!="" && inStr.indexOf(this.settings.separator)==-1){
					methods._loadRemoteData.call(this,{"keywords":inStr});//待处理：目前该控件暂不支持服务器分页，后期该功能加上后此处需要传递分页数据
				}else{
					methods._loadRemoteData.call(this);
				}
		},
		_createPagination:function(d){//创建分页
			var container=$("#WEB_selectMenu_container"),//当前容器
				menu=$("#WEB_selectMenu_container .WEB_selectMenu"),
				menuTop=Math.abs(parseInt(menu.css("top"))),//取当前列表滚过去的高度
				items=menu.find(".WEB_selectMenu_list"),
				loadedNum=items.length,//取当前已加载的选项用于确定已经加载到第几页
				criticalDom=items.last(),//临界DOM,当它出现在可视区时立即加载下一页数据
				viewH=parseInt(container.css("maxHeight"))+menuTop,//这个值用来判断临界点是否出现在可视区内
				curH=criticalDom.position().top,//临界DOM跟离下拉菜单顶部的高度
				curPage=Math.ceil(loadedNum/this.settings.baseNumber);//当前已加载的页数

			if(curH<=viewH){//临界DOM出现在可视区
				curPage++;//加载第二页的数据
				container.off("mousewheel");
				if(this.settings.isRemotePager){//线上分页
					methods._loadRemoteData.call(this,{"page":curPage});
				}else{//本地分页
					var startIndex=(curPage-1)*this.settings.baseNumber,
					endPoint=(curPage-1)*this.settings.baseNumber+(this.settings.baseNumber-1),
					appendData={"data":d.data.slice(startIndex,endPoint+1)};
					methods._appendPagerItem.call(this,appendData);
					container.on("mousewheel",{"source":d,"sourceContext":this},methods._mouseWheelScroll);
					methods._resetSliderPos.call(this);
				}
			}
		},
		_resetSliderPos:function(){//重置滑块的位置
			var	slider=$("#WEB_selectMenu_scroll .scroll_slider"),//滑块
				maxTop=slider.parent().height()-slider.height(),//滑块可以滑动的最大高度
				menu=$("#WEB_selectMenu_container .WEB_selectMenu"),
				menuTop=Math.abs(parseInt(menu.css("top"))),//取当前列表滚过去的高度
				curMenuH=menu.height(),//计算当前列表的总高度
				curRate=menuTop/curMenuH;//计算当前列表滚过去的高度与列表总高度的比例
			slider.animate({"top":curRate*maxTop});//按照列表比例重置滑块的位置
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
		_setSelectedValue:function(curItem){//设置选中的数据,curItem为当前选择的项，不传表示是全选 或者 反选
			var container=$("#WEB_selectMenu_container"),
				actives=container.find(".WEB_selectMenu_list_active"),
				oldValue=$(this).val(),
				oldValueArr=oldValue.length>0?oldValue.split(this.settings.separator):[],
				oldCode=$(this).attr("code")?$(this).attr("code"):'',
				oldCodeArr=oldCode.length>0?oldCode.split(this.settings.separator):[],
				valueArr=[],//存放选中的text值
				codeArr=[];//存放选中的code值
				if(this.settings.isMultiple){//多选
					if(arguments.length==0){//多选中的全选
						actives.each(function(){
							var t=$(this).text(),c=$(this).attr("code");
							if($.inArray(t,valueArr)<0){
								valueArr.push(t);
							}
							if($.inArray(c,codeArr)<0){
								codeArr.push(c);
							}
						})
					}else{//多选中的选择	
						var curValue=curItem.text(),curInd=$.inArray(curValue,oldValueArr),
							curCode=curItem.attr("code");
						if(curItem.hasClass('WEB_selectMenu_list_active')){//选择
							if(curInd<0){
								oldValueArr.push(curValue);
								oldCodeArr.push(curCode);
							}
						}else{//取消选择
							if(curInd>=0){
								oldValueArr.splice(curInd,1);
								oldCodeArr.splice(curInd,1);
							}
						}
						valueArr=oldValueArr.concat([]);
						codeArr=oldCodeArr.concat([]);
					}
				}else{//单选
					$(this).val("").removeAttr("code title");
					valueArr.push(curItem.text());
					codeArr.push(curItem.attr("code"));
				}
				
			if(valueArr.length==0){
				methods._openSelectMenu.call(this);//重新渲染下拉菜单
			}
			if(this.settings.isValueSort){//调用排序方法
				valueArr=methods._sortSelectedValue(valueArr);
				codeArr=methods._sortSelectedValue(codeArr);
			}
			var lastValue=valueArr.join(this.settings.separator),lastCode=codeArr.join(this.settings.separator);
			$(this).val(lastValue).attr({"code":lastCode,"title":lastValue});
            if($.isFunction(this.settings.onSelect)){
                this.settings.onSelect.call(this,valueArr,codeArr)
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
			var filterDataArr=[],_this=this;
			$.each(data.data,function(i,D){
				var Name=""+D.name;
				Name=Name.toLowerCase();
				targetStr=$.trim(targetStr.toLowerCase());
				if(_this.settings.isBeginWithKeywords){
					var testRule=new RegExp('^'+targetStr,'gi');
				}
				else{
					var testRule=new RegExp(targetStr,'gi');
				}
				if(testRule.test(Name)){
					filterDataArr.push(D);
				}
			})
			return {"data":filterDataArr,"totalSize":filterDataArr.length};
		},
		_lockScroll:function(targetDom){//锁定滚动条
			 if (targetDom.addEventListener) {
  				targetDom.addEventListener('DOMMouseScroll', methods._preventDefault,false);
			  }
			  targetDom.onmousewheel = document.onmousewheel = methods._preventDefault;
		},
		_unLockScroll:function(targetDom){//解除滚动条锁定
			 if (targetDom.removeEventListener) {
  				targetDom.removeEventListener('DOMMouseScroll', methods._preventDefault,false);
			  }
			  targetDom.onmousewheel = document.onmousewheel =null;
		},
		_preventDefault:function(e){//阻止默认事件
			  e = e || window.event;
			  if (e.preventDefault){
			      e.preventDefault();
			  }
			  e.returnValue = false;  
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
