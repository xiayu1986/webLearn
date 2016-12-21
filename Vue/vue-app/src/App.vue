<template>
	<div>
  	<pageNav :active="navData.activeName" :brand='navData.brand' :search="navData.search" :nav='navData.navLeftList' :option='navData.navRightList'>
  	</pageNav>
  	<div class="content container-fluid clearfix" >
	  	<div v-if="showView">
		  	<docTag :menu="sideMenu" :panel="panelData"></docTag>
		</div>
		<div v-if="!showView">
			<router-view></router-view>
		</div>
  	</div>
    <div class="prompt" ref="prompt" v-show="prompt.showPrompt" :style="prompt.type">{{prompt.text}}<span class="triangle"></span></div>
  	</div>
</template>

<script>
import pageNav from './components/pageNav.vue';
import contentPanel from './components/contentPanel.vue';
import doc from './components/document.vue';
export default {
  components:{"pageNav":pageNav,'contentPanel':contentPanel,"docTag":doc},
  data:function(){
  	 return {
     "prompt":{"showPrompt":false,"text":"提示信息","type":{"left":0,"top":0}},
  	 "showView":true,
  	 "navData":{
  	 	"navLeftList":[{"text":"说明文档","link":"/document"},
  	 	{"text":"下载插件","link":"/download"},
  	 	{"text":"提交BUG","link":"/bug"},
  	 	{"text":"上传插件","link":"/upload"}],
  	 	"navRightList":[],
  	 	"brand":{"text":"我的插件","link":"#"},"activeName":"说明文档",
  	 	"search":{"show":true,"placeHolder":"请输入关键字搜索","btnText":"搜索"}
      },
      "sideMenu":{"active":"","list":[]},
      "panelData":{"eventsDetail":"加载插件说明"}
    }
  },
  mounted:function(){
  	this.getRemoteData();
  },
  methods:{
  	getRemoteData:function () {
      this.$http.get('./src/data/page.json')
              .then(function (res) {
              	this.sideMenu=res.body;
              },function (res) {

              })
              .catch(function (response) {

              })
    }
  }
}
</script>
