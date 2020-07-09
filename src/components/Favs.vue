<template>
    <md-empty-state v-if="empty"
            md-rounded
            md-icon="favorite"
            md-label="No favourites yet!"
            md-description="Dummy text">
    </md-empty-state>
    <div class="md-layout md-gutter" v-else-if="!busy"  style="margin-bottom: 56px">
        <div
                class="md-layout-item md-size-33 md-medium-size-50 md-xsmall-size-100"
                v-for="game in games"
                :key="game.id"
                @click="getGame(game.id)">
            <md-card md-with-hover>
                <md-card-media-cover md-solid>
                    <md-card-media md-big>
                        <div class="container" :style='{ backgroundImage: "url(" + game.short_screenshots[0].image + ")", }'></div>
                    </md-card-media>
                    <md-card-area>
                        <md-card-header>
                            <span class="md-title">{{game.name}}</span>
                        </md-card-header>
                        <md-card-actions>
                              <span>
                                <md-button
                                        class="md-icon-button"
                                        @click.stop="remFavs(game.id,user.data.email,games.indexOf(game)),showSnackbarTrue=true, showSnackbarFalse=true">

                                </md-button>
                              </span>
                        </md-card-actions>
                    </md-card-area>
                </md-card-media-cover>
            </md-card>

            <!--      <md-snackbar
                          md-position="center"
                          :md-duration="1000"
                          :md-active.sync="showSnackbarTrue"
                          v-if="game.user_game == true">
                      <span>Inserted in favorites!</span>
                  </md-snackbar>
                  <md-snackbar
                          md-position="center"
                          :md-duration="1000"
                          :md-active.sync="showSnackbarFalse"
                          v-if="game.user_game == true">
                      <span>Remove from favorites!</span>
                  </md-snackbar> -->
        </div>
    <!--    <div id="load" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10" >
        </div>-->
    </div>
</template>
<script>
    import { mapGetters } from "vuex";

    import firebase from "firebase"
    export default {
        computed: {
            // mappa `this.user` a `this.$store.getters.user`
            ...mapGetters({
                user: "user"
            })
        },
        data: function() {
            return {
                games: [],
                empty:false,
                page:0,
                busy:true,


            };
        },
        created: function() {
            this.checkFavs(this.user.data.email);
            console.log("porcodio")
            console.log(this.games);
            this.$forceUpdate();
        },
        methods: {

            getGame(id) {
                this.$router.push({ name: 'game', params: { id } })
            },
           /*- loadMore() {
                //console.log("Adding more data results");
                this.busy = true;

                this.page += 10;
                this.checkFavs();


            },*/
            checkFavs(userId) {

                this.busy =true;
                let self=this;
                let db = firebase.firestore();
                console.log(userId);
                //controlliamo se è già inserito
                db.collection("favourites").where("user-id", "==", userId).get().then(function(doc) {
                    console.log(doc);
                    if (!doc.empty) {
                        self.games = doc.docs.map(doc => doc.data());
                       // self.page +=10;
                        self.busy = false;
                        console.log(self.games)
                    } else {
                        self.empty = true;
                        console.log("No games");
                    }
                }).catch(function(error) {
                    console.log("Error getting document:", error);
                });
            },

            remFavs(gameId, userId,elementId) {
                let id = "".concat(userId).concat("-").concat(gameId);
                let db = firebase.firestore();
                this.checkFavs(gameId, userId);
                let self=this;

                db.collection("favourites").doc(id).delete().then(function () {
                        console.log("Document successfully deleted!");
                       self.games.splice(elementId,1); // cancella il gioco dall'array
                    self.$forceUpdate();

                    }).catch(function (error) {
                        console.error("Error removing document: ", error);
                    });


            }

        }

    };
</script>

<style lang="scss" scoped>
    .md-app {
        max-height: 250px;
        border: 1px solid rgba(#000, .12);
    }

    .md-card {
        width: 450px;
        height: 300px;
        margin: 16px;
        display: inline-block;
        vertical-align: top;
        border-radius: 8px;
    }

    .container {
        width: 450px;
        height: 300px;
        background-size: cover;
        background-repeat: no-repeat;
        background-position: 50% 50%;
        border-radius: 8px;
    }

    .md-card-area {
        backdrop-filter: blur(32px);
        border-radius: 0 0 8px 8px;
    }

</style>

