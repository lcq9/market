import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import vueAxios from 'vue-axios'
import axios from 'axios';
import router from './router'

Vue.use(ElementUI);
Vue.use(vueAxios, axios);
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})