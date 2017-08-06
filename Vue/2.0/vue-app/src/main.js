// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import Router from 'vue-router';
import Goods from '@/components/goods/goods';
import Ratings from '@/components/ratings/ratings';
import Seller from '@/components/seller/seller';

Vue.config.productionTip = false;
Vue.use(Router);
let routes = [
  {path: '/goods', component: Goods, hidden: true},
  {path: '/ratings', component: Ratings, hidden: true},
  {path: '/seller', component: Seller, hidden: true},
  {path: '*', redirect: '/goods'}
];
let router = new Router({
  mode: 'history',
  linkActiveClass: 'active',
  scrollBehavior: () => ({// 设置滚动条起始位置
    y: 0
  }),
  routes: routes
});
/* eslint-disable no-new */
new Vue({
  components: {App},
  template: '<App/>',
  el: '#app',
  router
});
