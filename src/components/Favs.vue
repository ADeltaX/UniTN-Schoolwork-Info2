<template>
    <div style="position: relative; height: 100%">
        <div v-if="busy" style="position: absolute; width: 100%; z-index: 100;">
            <md-progress-bar class="md-accent" md-mode="indeterminate"></md-progress-bar>
        </div>
        <div v-else v-bind:class="[(favs.length == 0 || !user.loggedIn) ? 'centered-container' : '']">
            <md-empty-state v-if="!user.loggedIn"
                md-icon="favorite"
                md-label="Login to see your favourites!"
                md-description="By logging in, you'll be able to handle your favourites.">
                <md-button class="md-primary md-raised" @click="goTo('login')">Login</md-button>
            </md-empty-state>

            <md-empty-state v-else-if="favs.length == 0"
                md-icon="favorite"
                md-label="No favourites yet!"
                md-description="This page feels empty without your favourite games :(">
            </md-empty-state>

            <div v-else-if="!busy" class="md-layout md-gutter"  style="margin-bottom: 56px">
                <div
                    class="md-layout-item md-size-33 md-medium-size-50 md-xsmall-size-100"
                    v-for="game in games"
                    :key="game.id"
                    @click="getGame(game.id)">
                    <md-card md-with-hover>
                        <md-card-media-cover md-solid>
                            <md-card-media md-big>
                                <div class="container" :style='{ backgroundImage: "url(" + game.background_image + ")", }'></div>
                            </md-card-media>
                            <md-card-area>
                                <md-card-header>
                                    <span class="md-title">{{game.name}}</span>
                                </md-card-header>
                                <md-card-actions>
                                    <span>
                                        <md-button
                                                class="md-icon-button"
                                                @click.stop="remFavs(game.id, user.data.email, games.indexOf(game))">
                                            <md-icon>delete</md-icon>
                                        </md-button>
                                    </span>
                                </md-card-actions>
                            </md-card-area>
                        </md-card-media-cover>
                    </md-card>
                </div>
            <!--    <div id="load" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10" >
                </div>-->
            </div>
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
                favs: [],
                games: [],
                page: 0,
                busy: false,
            };
        },

        created: function() {
            if (this.user.loggedIn)
                this.checkFavs(this.user.data.email);
            this.$forceUpdate();
        },

        methods: {

            getGame(id) {
                this.$router.push({ name: 'game', params: { id } })
            },
            checkFavs(userId) {
                this.busy = true;
                let self = this;
                let db = firebase.firestore();
                //console.log(userId);
                //controlliamo se è già inserito
                db.collection("favourites").where("user-id", "==", userId).get().then(function(doc) {
                  //  console.log(doc);
                    if (!doc.empty) {
                        self.favs = doc.docs.map(doc => doc.data());
                       // self.page +=10;
                        self.busy = false;
                       // console.log("log self.favs");
                       // console.log(self.favs);
                        const axios = require("axios");
                        self.favs.forEach(el =>{
                            let url="https://api.rawg.io/api/games/".concat(el["game-id"]);
                            // console.log("I'm here: url="+url+"\n");
                            axios.get(url).then((response)=> {
                               // console.log(self);
                                self.games = self.games.concat(response.data);
                                //console.log("Game added")
                                })
                                .catch((error)=>{
                                    console.log(error);
                                })
                        });
                        self.busy=false;
                    } else {
                        console.log("No games");
                        self.busy=false;
                    }
                }).catch(function(error) {
                    console.log("Error getting document:", error);
                    self.busy=false;
                });
            },

            remFavs(gameId, userId,elementId) {
                let id = "".concat(userId).concat("-").concat(gameId);
                let db = firebase.firestore();
                //this.checkFavs(gameId, userId);
                let self = this;

                db.collection("favourites").doc(id).delete().then(function () {
                    console.log("Document successfully deleted!");
                    self.games.splice(elementId,1); // cancella il gioco dall'array
                    self.favs.splice(elementId,1);
                    self.$forceUpdate();
                }).catch(function (error) {
                    console.error("Error removing document: ", error);
                });
            },
            
            goTo(x) {
                this.$router.push({ name: x });
            }
        }
    };
</script>

<style scoped>
    .centered-container {
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        height: 100% !important;
    }
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