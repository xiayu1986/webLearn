import Vue from 'vue';
import App from './App.vue';
import VueRouter from "vue-router";
import VueResource from "vue-resource";
import './assets/css/bootstrap.min.css';
import './assets/css/theme.css';
import document from './components/document.vue';
import download from './components/download.vue';
import bug from './components/bug.vue';
import upload from './components/upload.vue';
import panel from './components/contentPanel.vue';

Vue.use(VueRouter);
Vue.use(VueResource);

const routes=[
	{path:"/",redirect:"/document/dialog",component:document},//首页
	{path:"/document",component:document},//说明文档
	{path:"/document/:link",components:{default:panel,panel:panel}},//说明文档对应二级页面
	{path:"/bug",component:bug},//提交BUG
	{path:"/upload",component:upload},//上传插件
	{path:"/download",component:download}//下载插件
];

const router=new VueRouter({routes:routes});


const app=new Vue({
	router:router,
	render:h => h(App)
}).$mount("#container")
