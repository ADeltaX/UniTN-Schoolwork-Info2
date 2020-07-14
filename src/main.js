import Vue from 'vue'
import App from './App.vue'

//import foes from "./foes"
import store from "./store";
import router from "./routes/index";

import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/black-green-light.css'
import axios from 'axios'

Vue.use(VueMaterial)

let infiniteScroll = require('vue-infinite-scroll');
Vue.use(infiniteScroll)


Vue.config.productionTip = false
Vue.prototype.$http = axios

var shared = new Vue({
    data: {
        pageLoading: false
    }
});

shared.install = function () {
    Object.defineProperty(Vue.prototype, '$g', {
        get() {
            return shared
        }
    });
};
Vue.use(shared);

import "@firebase/app";
import "@firebase/firestore";

require('firebase/auth')

new Vue({
    // foes,
    router,
    store,
    render: h => h(App)
}).$mount("#app");