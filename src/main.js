import Vue from 'vue'
import App from './App.vue'

//import * as firebase from "firebase";
import store from "./store";
import router from "./routes/index";

import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/black-green-light.css'
import axios from 'axios'

Vue.use(VueMaterial)

let infiniteScroll =  require('vue-infinite-scroll');
Vue.use(infiniteScroll)


Vue.config.productionTip = false
Vue.prototype.$http = axios




new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");





