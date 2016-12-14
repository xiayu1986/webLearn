<template>
	<div>
  	<pageNav :active="navData.activeName" :brand='navData.brand' :search="navData.search" :nav='navData.navLeftList' :option='navData.navRightList'>
  	</pageNav>
  	<div class="content clearfix">
	  	<div v-if="showView">
		  	<sideMenu :menu="sideMenu"></sideMenu>
		  	<contentPanel></contentPanel>
		</div>
		<div v-if="!showView">
			<router-view></router-view>
		</div>
  	</div>
  	</div>
</template>

<script>
import pageNav from './components/pageNav.vue';
import sideMenu from './components/sideMenu.vue';
import contentPanel from './components/contentPanel.vue';
export default {
  components:{"pageNav":pageNav,'sideMenu':sideMenu,'contentPanel':contentPanel},
  data:function(){
  	 return {
  	 "showView":true,
  	 "navData":{
  	 	"navLeftList":[{"text":"说明文档","link":"/document"},
  	 	{"text":"下载插件","link":"/download"},
  	 	{"text":"提交BUG","link":"/bug"},
  	 	{"text":"上传插件","link":"/upload"}],
  	 	"navRightList":[],
  	 	"brand":{"text":"插件无忧","link":"#"},"activeName":"说明文档",
  	 	"search":{"show":true,"placeHolder":"请输入关键字搜索","btnText":"搜索"}
      },
      "sideMenu":{"active":"弹出框","list":['弹出框','下拉列表','数据格式化','树形菜单','右键菜单','数据表格','分页']}
    }
  }
}
</script>

<style>
.content{ padding-top:65px;}
#container{text-shadow:1px 1px 5px rgba(102, 175, 233, 0.8)}
</style>
