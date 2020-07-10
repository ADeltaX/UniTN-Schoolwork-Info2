<template>
  <div title="app">
    <md-app md-waterfall md-mode="fixed">
      <md-app-toolbar class="md-primary">
        <div class="md-toolbar-row">
          <md-button class="md-icon-button" @click="menuVisible = !menuVisible">
            <md-icon>menu</md-icon>
          </md-button>
          <span class="md-title">Game Review</span>
          <!-- <md-autocomplete
            class="search"
            :md-options="dataForSearchbox"
            md-layout="box" style="max-width: 240px; margin: 0px 16px 0px 16px">
            <label>Search...</label>
          </md-autocomplete> -->
          <div class="md-toolbar-section-end">
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
          <router-link to="/reviews">
            <md-list-item @click="closeDrawer()">
              <md-icon>rate_review</md-icon>
              <span class="md-list-item-text">Reviews</span>
            </md-list-item>
          </router-link>
          <router-link to="/favs">
            <md-list-item @click="closeDrawer()">
              <md-icon>favorite</md-icon>
              <span class="md-list-item-text">Favourites</span>
            </md-list-item>
          </router-link>
          <router-link to="/platforms">
            <md-list-item @click="closeDrawer()">
              <md-icon>video_label</md-icon>
              <span class="md-list-item-text">Platforms</span>
            </md-list-item>
          </router-link>
          <router-link to="/pubs">
            <md-list-item @click="closeDrawer()">
              <md-icon>person</md-icon>
              <span class="md-list-item-text">Publishers</span>
            </md-list-item>
          </router-link>
          <router-link to="/devs">
            <md-list-item @click="closeDrawer()">
              <md-icon>group</md-icon>
              <span class="md-list-item-text">Developers</span>
            </md-list-item>
          </router-link>
          <md-divider v-if="user.loggedIn" style="margin: 8px 0 8px 0"></md-divider>
          <router-link v-if="user.loggedIn" to="/user" style="margin-bottom: -400px;">
            <md-list-item @click="closeDrawer()">
              <md-icon>settings</md-icon>
              <span class="md-list-item-text">Settings</span>
            </md-list-item>
          </router-link>
        </md-list>
      </md-app-drawer>
      <md-app-content>
          <router-view></router-view>
      </md-app-content>
    </md-app>
  </div>
</template>

<script>

  import "@firebase/app";
  import firebase from "@firebase/app";
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

    name: "app",

    data: () => ({
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
</style>

<style>
  .md-card {
    width: 450px;
    height: 300px;
    margin: 16px;
    display: inline-block;
    vertical-align: top;
    border-radius: 8px;
  }

  .md-card-area {
    backdrop-filter: blur(32px);
    border-radius: 0 0 8px 8px;
  }

  .img-container {
    width: 450px;
    height: 300px;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: 50% 50%;
    border-radius: 8px;
  }
</style>
