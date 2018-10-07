import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store'

import VueWorldCloud from 'vuewordcloud';
import axios from 'axios';
import VueAxios from "vue-axios";
import Loading from 'vue-loading-overlay';


import 'vue-loading-overlay/dist/vue-loading.css';
import './registerServiceWorker'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'


axios.defaults.headers.post['Content-Type'] = 'application/json';
Vue.use(VueAxios,axios);
Vue.component(VueWorldCloud.name,VueWorldCloud);
Vue.component('Loading', Loading);
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
