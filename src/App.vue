<template>
  <div>
    <md-app md-waterfall md-mode="fixed">
      <md-app-toolbar class="md-primary">
        <div class="md-toolbar-row">
          <md-button v-if="loaded" class="md-icon-button" @click="menuVisible = !menuVisible">
            <md-icon>menu</md-icon>
          </md-button>
          <span class="md-title">Game Review</span>
          <!-- <md-autocomplete
            class="search"
            :md-options="dataForSearchbox"
            md-layout="box" style="max-width: 240px; margin: 0px 16px 0px 16px">
            <label>Search...</label>
          </md-autocomplete> -->
          <div v-if="loaded" class="md-toolbar-section-end">
            <md-button @click="logout" v-if="user.loggedIn">
              Logout
            </md-button>
            <template v-else>
              <md-button @click="goTo('login')" >
                Login
              </md-button>
              <md-button @click="goTo('register')">
                Register
              </md-button>
            </template>
          </div>
        </div>
      </md-app-toolbar>
      <md-app-drawer :md-active.sync="menuVisible">
        <md-toolbar class="md-transparent" md-permanent="clipped" md-elevation="0">
          <template v-if="user.loggedIn">
            <div v-if="user.data.displayName!=null">
              <md-avatar class="md-avatar-icon md-primary" style="margin: 8px 8px 8px 0px">{{user.data.displayName.toUpperCase()[0]}}</md-avatar>
              <b> {{user.data.displayName.toUpperCase()}} </b>
            </div>
          </template>
          <template v-else>
            <div>
              <b> OSPITE </b>
            </div>
           <!-- <b>Not logged in</b> -->
          </template>
        </md-toolbar>
        <md-list>
          <md-divider style="margin: -8px 0 8px 0"></md-divider>
          <router-link to="/" exact>
            <md-list-item @click="closeDrawer()">
              <md-icon>home</md-icon>
              <span class="md-list-item-text">Home</span>
            </md-list-item>
          </router-link>
          <router-link :to="{ name: 'reviews'}">
            <md-list-item @click="closeDrawer()">
              <md-icon>rate_review</md-icon>
              <span class="md-list-item-text">Reviews</span>
            </md-list-item>
          </router-link>
          <router-link :to="{ name: 'favs'}">
            <md-list-item @click="closeDrawer()">
              <md-icon>favorite</md-icon>
              <span class="md-list-item-text">Favourites</span>
            </md-list-item>
          </router-link>
          <router-link :to="{ name: 'platforms'}">
            <md-list-item @click="closeDrawer()">
              <md-icon>video_label</md-icon>
              <span class="md-list-item-text">Platforms</span>
            </md-list-item>
          </router-link>
          <router-link :to="{ name: 'pubs'}">
            <md-list-item @click="closeDrawer()">
              <md-icon>person</md-icon>
              <span class="md-list-item-text">Publishers</span>
            </md-list-item>
          </router-link>
          <router-link :to="{ name: 'devs'}">
            <md-list-item @click="closeDrawer()">
              <md-icon>group</md-icon>
              <span class="md-list-item-text">Developers</span>
            </md-list-item>
          </router-link>
          <md-divider v-if="user.loggedIn" style="margin: 8px 0 8px 0"></md-divider>
          <router-link v-if="user.loggedIn" :to="{ name: 'user'}" style="margin-bottom: -400px;">
            <md-list-item @click="closeDrawer()">
              <md-icon>settings</md-icon>
              <span class="md-list-item-text">Settings</span>
            </md-list-item>
          </router-link>
        </md-list>
      </md-app-drawer>
      <md-app-content>
        <div v-if="!loaded" class="centered-container">
          <md-progress-spinner md-mode="indeterminate"></md-progress-spinner>
        </div>
        <router-view v-else></router-view>
      </md-app-content>
    </md-app>
  </div>
</template>

<script>

  import "@firebase/app";
  import firebase from "@firebase/app";
  import store from "./store";
  import "@firebase/firestore";
 // import firebase from 'firebase'
  import { mapGetters } from "vuex";

  export default
  {
    computed: {
      // mappa `this.user` a `this.$store.getters.user`
      ...mapGetters({
        user: "user"
      })
    },

    created() {
      const configOptions = {
        apiKey: "AIzaSyA86bFqzVk8ukOzjf3E61J9YEBzolj2Wb0",
        authDomain: "gamereview-bb9af.firebaseapp.com",
        databaseURL: "https://gamereview-bb9af.firebaseio.com",
        projectId: "gamereview-bb9af",
        storageBucket: "gamereview-bb9af.appspot.com",
        messagingSenderId: "228925046389",
        appId: "1:228925046389:web:e33f2978a7a8757812823c"
      };

      !firebase.apps.length ? firebase.initializeApp(configOptions) : firebase.app();
      firebase.firestore()
      firebase.auth().onAuthStateChanged(user => {
        store.dispatch("fetchUser", user);
        this.loaded = true;
      });
    },

    name: "GameReview",

    data: () => ({
      loaded: false,
      menuVisible: false,
      showDialog: false,
      //dataForSearchbox: []
    }),

    methods:{
      logout() {
        firebase.auth()
        .signOut()
        .then(() => {
          this.$router.replace({
            path: "/"
          });
        });
      },

      closeDrawer() {
        this.$data.menuVisible = false;
      },

      goTo(x) {
        this.$router.push({path: "/".concat(x)});
        this.$forceUpdate();
      }
    }
  };
</script>

<style scoped>
  .md-app {
    height: 100vh;
    overflow-y: hidden;
    border: 1px solid rgba(#000, .12);
  }

  .md-drawer {
    max-width: 320px;
  }

  .md-list-item {
    border-radius: 0 24px 24px 0;
    padding-right: 16px;
  }

  .router-link-active {
    background-color: #6dd5ed80;
    margin-right: 8px;
    border-radius: 0 24px 24px 0;
  }

  .centered-container {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    height: 100%;
  }
</style>

<style>
  .centered-container {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    height: 100% !important;
  }

  .flex-container {
    display: flex;
    width: 100%;
    flex-wrap: wrap;
    justify-content: center;
  }

  .md-card {
    width: 450px;
    height: 300px;
    margin: 16px;
    display: inline-block;
    vertical-align: top;
    border-radius: 8px !important;
    transition: all .25s ease-out !important;
    transition-property: box-shadow, height, background;
  }

  .md-card .md-title {
      transition: font-size .25s ease-out;
    }

  .md-card-area {
    backdrop-filter: blur(32px);
    border-radius: 0px 0px 8px 8px;
    transition: height .25s ease-out;
  }

  .img-container {
    width: 100%;
    height: 300px;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: 50% 50%;
    border-radius: 8px;
    transition: height .25s ease-out;
  }

  @media only screen and (max-width: 520px) {
    .md-card {
      width: calc(100% - 32px);
      height: 240px;
      transition: all .25s ease-out !important;
      transition-property: box-shadow, height, background;
    }

    .img-container {
      height: 240px;
      transition: height .25s ease-out;
    }

    .md-card .md-title {
      font-size: 16px !important;
      line-height: 20px !important;
      transition: font-size .25s ease-out;
    }
  } 

  @media only screen and (max-width: 240px) {
    .md-card {
      width: 180px;
    }

    .md-card .md-title {
      font-size: 12px !important;
      line-height: 16px !important;
      transition: font-size .25s ease-out;
    }
  }

  .md-progress-bar {
    margin: -16px;
  }
</style>
