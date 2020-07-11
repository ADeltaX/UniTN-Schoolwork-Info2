<template>
    <div class="md-layout md-gutter">
        <div
            class="md-layout-item md-size-33 md-medium-size-50 md-xsmall-size-100"
            v-for="game in dev"
            :key="game.id"
            @click="getGame(game.id,game.slug)">
            <md-card md-with-hover>
                <md-card-media-cover md-solid>
                    <md-card-media md-big>
                        <div class="img-container" :style='{ backgroundImage: "url(" + game.background_image + ")", }'></div>
                    </md-card-media>
                    <md-card-area>
                        <md-card-header>
                            <span class="md-title">{{game.name}}</span>
                        </md-card-header>
                        <md-card-actions v-if="user.loggedIn">
                              <span>
                                <md-button
                                        class="md-icon-button"
                                        @click.stop="addFavs(game.id,user.data.email,dev.indexOf(game))">
                                  <md-icon v-if="user.loggedIn">{{game.user_game ? 'favorite' : 'favorite_border'}}</md-icon>
                                </md-button>
                              </span>
                        </md-card-actions>
                    </md-card-area>
                </md-card-media-cover>
            </md-card>
            <md-snackbar
                    md-position="center"
                    :md-duration="1000"
                    :md-active.sync="showSnackbarTrue"
                    v-if="game.user_game === true">
                <span>Inserted in favorites!</span>
            </md-snackbar>
            <md-snackbar
                    md-position="center"
                    :md-duration="1000"
                    :md-active.sync="showSnackbarFalse"
                    v-if="game.user_game === true">
                <span>Remove from favorites!</span>
            </md-snackbar>
        </div>
        <div id="load" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10" >
        </div>
    </div>
</template>

<script>

    import {mapGetters} from "vuex";
    import "@firebase/app";
    import firebase from "@firebase/app";
    import "@firebase/firestore";

    export default {
        data: function() {
            return {
                dev: [],
                page:0,
                busy:false
            };
        },
        computed: {
            // mappa `this.user` a `this.$store.getters.user`
            ...mapGetters({
                user: "user"
            })
        },
        created: function() {
            this.loadMore();
            this.$forceUpdate();
        },
        methods: {

            goBack: function() {
                this.$router.back();
            },
            getGame(id,slug) {
                this.$router.push({ name: 'game', params: { id,slug } })
            },
        checkFavs(gameId, userId,elementId) {
            let id = "".concat(userId).concat('-').concat(gameId);
            let self=this;
            let db = firebase.firestore();
            //controlliamo se è già inserito
            db.collection("favourites").doc(id)
                .get().then(function (ris) {
                self.dev[elementId].user_game =ris.exists;
            }).catch(function (error) {
                console.error("Error reading document: ", error);
            });
        },

        addFavs(gameId, userId,elementId) {
            let id = "".concat(userId).concat("-").concat(gameId);
            let db = firebase.firestore();
            this.checkFavs(gameId, userId,elementId);
            let self=this;

            if(this.dev[elementId].user_game)
            {
                db.collection("favourites").doc(id).delete().then(function () {
                    console.log("Document successfully deleted!");
                    self.dev[elementId].user_game = false;

                }).catch(function (error) {
                    console.error("Error removing document: ", error);
                });
            } else {
                //altrimenti lo aggiungiamo
                db.collection("favourites").doc(id).set({
                    "user-id": userId,
                    "game-id": gameId
                }).then(function () {
                    console.log("Document successfully added!");
                    self.dev[elementId].user_game = true;
                }).catch(function (error) {
                    console.error("Error adding document: ", error);
                });

            }

        },
            loadMore() {
                this.loading = true;
                this.page += 1;
                const axios = require("axios");
                let url="https://api.rawg.io/api/games?page=".concat(this.page).concat("&developers=").concat(this.$route.params.id);
                axios.get(url).then((response)=>{
                    this.dev = this.dev.concat(response.data.results);
                    this.dev.forEach(el => {
                        this.checkFavs(el.id,this.user.data.email,this.dev.indexOf(el))
                    });
                    this.busy = false;

                    //console.log(response)
                })
                    .catch((error)=>{
                        console.log(error)
                    });

                this.$forceUpdate();


            }

        }
    };
</script>

<style scoped>
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