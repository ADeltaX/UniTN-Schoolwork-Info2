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


import firebase from 'firebase';

const configOptions = {
  apiKey: "AIzaSyA86bFqzVk8ukOzjf3E61J9YEBzolj2Wb0",
  authDomain: "gamereview-bb9af.firebaseapp.com",
  databaseURL: "https://gamereview-bb9af.firebaseio.com",
  projectId: "gamereview-bb9af",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};

!firebase.apps.length ? firebase.initializeApp(configOptions).firestore() : firebase.app().firestore();

firebase.auth().onAuthStateChanged(user => {
  store.dispatch("fetchUser", user);
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");





