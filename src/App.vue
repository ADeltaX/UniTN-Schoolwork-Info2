<template>
  <div title="app">
    <md-app md-mode="reveal">
      <md-app-toolbar class="md-primary">
          <md-button class="md-icon-button" @click="menuVisible = !menuVisible">
            <md-icon>menu</md-icon>
          </md-button>
          <span class="md-title">Game Review</span>
        <div class="md-toolbar-section-end">
          <md-button @click="goTo(4)" class="md-icon-button" v-if="user.loggedIn">
            Login
          </md-button>
          <md-button @click="goTo(5)" class="md-icon-button" v-if="user.loggedIn">
            Register
          </md-button>

        </div>
      </md-app-toolbar>


      <md-app-drawer :md-active.sync="menuVisible">
        <md-toolbar class="md-transparent" md-elevation="0">Navigation</md-toolbar>

        <md-list>
          <md-list-item>
            <md-icon>move_to_inbox</md-icon>
            <span class="md-list-item-text" @click="goTo(0)">Home</span>
          </md-list-item>

          <md-list-item>
            <md-icon>send</md-icon>
            <span class="md-list-item-text" @click="goTo(1)">Platforms</span>
          </md-list-item>

          <md-list-item>
            <md-icon>delete</md-icon>
            <span class="md-list-item-text" @click="goTo(2)">Developers</span>
          </md-list-item>

          <md-list-item>
            <md-icon>error</md-icon>
            <span class="md-list-item-text" @click="goTo(3)">Publishers</span>
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
          switch(x)
          {
               case 0:
                   this.$router.replace({
                     name: "home"
                    });
                 break;

                case 1:
                   this.$router.replace({
                     name: "platforms"
                    });
                break;

                case 2:
                  this.$router.replace({
                     name: "devs"
                  });
                break;
                case 3:
                  this.$router.replace({
                     name: "pubs"
                   });
                break;
                case 4:
                  this.$router.replace({
                    name: "login"
                  });
                  break;
                case 5:
                  this.$router.replace({
                    name: "register"
                  });
                  break;
          }
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