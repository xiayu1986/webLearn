import Vue from 'vue';
import App from './App.vue';
import VueRouter from "vue-router";
import './assets/css/bootstrap.min.css';
import './assets/css/theme.css';
import document from './components/document.vue';
import download from './components/download.vue';
import bug from './components/bug.vue';
import upload from './components/upload.vue';

Vue.use(VueRouter);

const routes=[
	{path:"/document",component:document},
	{path:"/bug",component:bug},
	{path:"/upload",component:upload},
	{path:"/download",component:download}
];

const router=new VueRouter({routes:routes});


const app=new Vue({
	router:router,
	render:h => h(App),
}).$mount("#container")
