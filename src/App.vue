<template>
  <div title="app">
    <md-app md-mode="reveal">
      <md-app-toolbar class="md-primary">
          <md-button class="md-icon-button" @click="menuVisible = !menuVisible">
            <md-icon>menu</md-icon>
          </md-button>
          <span class="md-title">Game Review</span>
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
      </md-app-toolbar>


      <md-app-drawer :md-active.sync="menuVisible">
        <md-toolbar class="md-transparent" md-elevation="0">Navigation</md-toolbar>

        <md-list>
          <md-list-item>
            <md-icon>move_to_inbox</md-icon>
            <span class="md-list-item-text" @click="goTo('home')">Home</span>
          </md-list-item>

          <md-list-item>
            <md-icon>send</md-icon>
            <span class="md-list-item-text" @click="goTo('platforms')">Platforms</span>
          </md-list-item>

          <md-list-item>
            <md-icon>delete</md-icon>
            <span class="md-list-item-text" @click="goTo('devs')">Developers</span>
          </md-list-item>

          <md-list-item>
            <md-icon>error</md-icon>
            <span class="md-list-item-text" @click="goTo('pubs')">Publishers</span>
          </md-list-item>
        </md-list>
      </md-app-drawer>

      <md-app-content>
        <router-view></router-view>

      </md-app-content>
    </md-app>
  </div>
</template>

<script>

  import firebase from "firebase";
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
      showDialog:false
    }),
    methods:{
      logout()
      {

        firebase.auth()
                .signOut()
                .then(() => {
                  this.$router.replace({
                    name: "home"
                  });
                });
      },
      goTo(x)
      {
        this.$router.replace({
          name: x
        });
      }

    }
    }
    ;
</script>

<style lang="scss" scoped>
  .md-app {
    max-height: 1080px;
    border: 1px solid rgba(#000, .12);
  }


  .md-drawer {
    width: 230px;
    max-width: calc(100vw - 125px);
  }

</style>