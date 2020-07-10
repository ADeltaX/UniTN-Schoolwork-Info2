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


import "@firebase/app";
import firebase from "@firebase/app";
import "@firebase/firestore";
require('firebase/auth')

//javascript è bello :D
//con questi non va
//import firebase from 'firebase';
//const firebase = require("firebase");
// Required for side-effects
//require("firebase/firestore");

const configOptions = {
  apiKey: "AIzaSyA86bFqzVk8ukOzjf3E61J9YEBzolj2Wb0",
  authDomain: "gamereview-bb9af.firebaseapp.com",
  databaseURL: "https://gamereview-bb9af.firebaseio.com",
  projectId: "gamereview-bb9af",
  storageBucket: "",
  messagingSenderId: "",
  appId: "1:228925046389:web:e33f2978a7a8757812823c"
};

console.log(firebase.initializeApp(configOptions))
!firebase.apps.length ? firebase.initializeApp(configOptions) : firebase.app();
//firebase.initializeApp(configOptions)
firebase.firestore()
firebase.auth().onAuthStateChanged(user => {
  store.dispatch("fetchUser", user);
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");





