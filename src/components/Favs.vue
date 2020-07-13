<template>
    <div v-if="!this.$g.pageLoading" v-bind:class="[(favs.length == 0 || !user.loggedIn) ? 'centered-container' : '']">
        <md-empty-state v-if="!user.loggedIn"
            md-icon="favorite"
            md-label="Accedi per vedere i tuoi preferiti!"
            md-description="Accedendo potrai gestire i tuoi preferiti.">
            <md-button class="md-primary md-raised" @click="foes.goTo($router,'login')">Login</md-button>
        </md-empty-state>

        <md-empty-state v-else-if="favs.length == 0"
            md-icon="favorite"
            md-label="Nessun preferito!"
            md-description="Questa pagina è vuota senza i tuoi giochi preferiti :(">
        </md-empty-state>
        <div>
            <div v-if="!this.$g.pageLoading && user.loggedIn" class="flex-container" style="margin-bottom: 24px">
                <md-card md-with-hover v-for="game in games"
                :key="game.id">
                    <router-link :to="`/game/${game.id}/`">
                        <md-card-media-cover>
                            <md-card-media md-big>
                                <div class="img-container" :style='{ backgroundImage: "url(" + foes.getResizedImage(game.background_image) + ")", }'></div>
                            </md-card-media>
                            <md-card-area>
                                <md-card-header>
                                    <span class="md-title">{{game.name}}</span>
                                </md-card-header>
                                <md-card-actions>
                                    <span>
                                        <md-button
                                                class="md-icon-button" @click.prevent
                                                @click="remFavs(game.id, user.data.email, games.indexOf(game))">
                                            <md-icon>delete</md-icon>
                                        </md-button>
                                    </span>
                                </md-card-actions>
                            </md-card-area>
                        </md-card-media-cover>
                    </router-link>
                </md-card>
            </div>
        </div>
        <md-snackbar :md-active.sync="showSnackbar">
            <span>{{msg}}</span>
        </md-snackbar>
    </div>
</template>
<script>
    import { mapGetters } from "vuex";

    import "@firebase/app";
    import firebase from "@firebase/app";
    import "@firebase/firestore";
    import foes from "../foes"

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
                msg: "",
                showSnackbar: false,
                foes
            };
        },

        created: function() {
            console.clear();
            if (this.user.loggedIn)
                this.checkFavs(this.user.data.email);
            else
                this.$g.pageLoading = false;
            this.$forceUpdate();
        },

        methods: {

            checkFavs(userId) {
                this.$g.pageLoading = true;
                let self = this;
                let db = firebase.firestore();
                //console.log(userId);
                //controlliamo se è già inserito
                db.collection("favourites").where("user-id", "==", userId).get().then(function(doc) {
                  //  console.log(doc);
                    if (!doc.empty) {
                        self.favs = doc.docs.map(doc => doc.data());
                       // self.page +=10;
                        self.$g.pageLoading = false;
                       // console.log("log self.favs");
                       // console.log(self.favs);
                        const axios = require("axios");
                        self.favs.forEach(el => {
                            let url="https://api.rawg.io/api/games/".concat(el["game-id"]);
                            // console.log("I'm here: url="+url+"\n");
                            axios.get(url).then((response) => {
                               // console.log(self);
                                self.games = self.games.concat(response.data);
                                //console.log("Game added")
                            })
                            .catch((error) => {
                                console.log(error);
                            })
                        });
                    } else {
                        console.log("No games");
                        self.$g.pageLoading = false;
                    }
                }).catch(function(error) {
                    console.log("Error getting document:", error);
                    self.$g.pageLoading = false;
                });
            },

            remFavs(gameId, userId, elementId) {
                let id = "".concat(userId).concat("-").concat(gameId);
                let db = firebase.firestore();
                //this.checkFavs(gameId, userId);
                let self = this;

                db.collection("favourites").doc(id).delete().then(function () {
                    self.showSnackbar = false;
                    self.showSnackbar = true;
                    
                    self.msg = "Rimosso dai preferiti!";

                    self.games.splice(elementId,1); // cancella il gioco dall'array
                    self.favs.splice(elementId,1);
                    self.$forceUpdate();
                }).catch(function (error) {
                    console.error("Error removing document: ", error);
                });
            }
        }
    };
</script>
