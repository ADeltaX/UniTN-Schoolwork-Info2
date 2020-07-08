<template>
  <div title="app">
    <md-app>
      <md-app-toolbar class="md-large md-dense md-primary">
        <div class="md-toolbar-row">
          <div class="md-toolbar-section-start">
            <md-button class="md-icon-button" @click="menuVisible = !menuVisible">
              <md-icon>menu</md-icon>
            </md-button>

            <span class="md-title">Game Review</span>
          </div>

          <div class="md-toolbar-section-end">
            <md-button class="md-icon-button">
              <md-icon>more_vert</md-icon>
            </md-button>
          </div>
        </div>

        <div class="md-toolbar-row">
          <md-tabs class="md-primary">
            <md-tab id="tab-home" md-label="Home" to="/Home"></md-tab>
            <md-tab id="tab-pages" md-label="Ranking"></md-tab>
            <md-tab id="tab-posts" md-label="Latest"></md-tab>
            <md-tab id="tab-favorites" md-label="Favorites"></md-tab>
          </md-tabs>
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

  export default
  {
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

  // Demo purposes only
  .md-drawer {
    width: 230px;
    max-width: calc(100vw - 125px);
  }
</style>