<template>
    <div class="md-layout md-gutter" style="margin-bottom: 56px">
        <div
            class="md-layout-item md-size-33 md-medium-size-50 md-xsmall-size-100"
            v-for="game in games"
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
                                        @click.stop="addFavs(game.id,user.data.email,games.indexOf(game))">
                                  <md-icon v-if="user.loggedIn">{{game.user_game ? 'favorite' : 'favorite_border'}}</md-icon>
                                </md-button>
                              </span>
                        </md-card-actions>
                    </md-card-area>
                </md-card-media-cover>
            </md-card>
        </div>
        <div id="load" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10" >
        </div>
    </div>
</template>

<script>
    import { mapGetters } from "vuex";
    import "@firebase/app";
    import firebase from "@firebase/app";
    import "@firebase/firestore";

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
                page:0,
                busy:false,
                //foes

            };
        },
        created: function() {
            console.clear();
            this.loadMore();
            this.$forceUpdate();
        },
        methods: {

            getGame(id,slug) {
                this.$router.push({ name: 'game', params: { id,slug } })
            },
            loadMore() {
                //console.log("Adding more data results");
                this.busy = true;

                this.page += 1;
                const axios = require("axios");
                let url="https://api.rawg.io/api/games?page=".concat(this.page);
                axios.get(url).then((response)=>{
                    this.games = this.games.concat(response.data.results);
                    this.games.forEach(el => {
                        this.checkFavs(el.id,this.user.data.email,this.games.indexOf(el))
                    })
                    this.busy = false;
                    console.log(response)
                })
                    .catch((error)=>{
                        console.log(error)
                    });
                this.loading = false;
                this.$forceUpdate();


            },
            checkFavs(gameId, userId,elementId) {
                let id = "".concat(userId).concat('-').concat(gameId);
                 let self=this;
                 let db = firebase.firestore();
                //controlliamo se è già inserito
                db.collection("favourites").doc(id)
                    .get().then(function (ris) {
                    self.games[elementId].user_game =ris.exists;
                    }).catch(function (error) {
                    console.error("Error reading document: ", error);
                });
            },

            addFavs(gameId, userId,elementId) {
                let id = "".concat(userId).concat("-").concat(gameId);
                let db = firebase.firestore();
                this.checkFavs(gameId, userId,elementId);
                let self=this;

                if(this.games[elementId].user_game)
                {
                    db.collection("favourites").doc(id).delete().then(function () {
                        console.log("Document successfully deleted!");
                        self.games[elementId].user_game = false;

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
                        self.games[elementId].user_game = true;
                    }).catch(function (error) {
                        console.error("Error adding document: ", error);
                    });

                }

            }

        }

    };
</script>