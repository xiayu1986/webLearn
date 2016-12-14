<template>
	<div>
  	<pageNav :active="activeName" :brand='brand' :search="search" :nav='navLeftList' :option='navRightList'>
  	</pageNav>
  	<div class="content clearfix">
  	<sideMenu :menu="sideMenu"></sideMenu>
  	<contentPanel></contentPanel>
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
      "navLeftList":[
      {"text":"文档","active":false,"link":"#"},
      {"text":"下载","active":false,"link":"#"}
      ],
      "navRightList":[{"text":"提交BUG","active":false,"link":"#"},
      {"text":"上传插件","active":false,"link":"#"},
      {"text":"GitHub","active":false,"link":"#"}
      ],
      "brand":{"text":"插件无忧","link":"#"},
      "activeName":"文档",
      "search":{"show":true,"placeHolder":"请输入关键字搜索","btnText":"搜索"},
      "sideMenu":{"active":"弹出框","list":['弹出框','下拉列表','数据格式化','树形菜单','右键菜单','数据表格','分页']}
    }
  }
}
</script>

<style>
.content{ padding-top:65px;}
#container{text-shadow:1px 1px 5px rgba(102, 175, 233, 0.8)}
</style>
