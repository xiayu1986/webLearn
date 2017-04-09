import Vue from 'vue';
import App from './App.vue';
import VueResource from 'vue-resource';
Vue.use(VueResource);
new Vue({
  el: '#bootstrapApp',
  components: { App }
})
Vue.http.interceptors.push(function (res,next) {
  console.log("请求发送前")
  next(function (res) {
   console.log(res)
  })
})