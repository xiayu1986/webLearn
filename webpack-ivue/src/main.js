import Vue from 'vue';
import App from './App.vue';
import './assets/css/bootstrap.min.css';
import './assets/css/theme.css';
import iView from 'iview';
import 'iview/dist/styles/iview.css';
Vue.use(iView);

new Vue({
  el: '#app',
  render: h => h(App)
})
