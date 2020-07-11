<template>
    <div>
        <div v-if="busy" style="position: absolute; width: 100%; z-index: 100;">
            <md-progress-bar class="md-accent" md-mode="indeterminate"></md-progress-bar>
        </div>
        <div class="flex-container" style="margin-bottom: 24px">
            <md-card md-with-hover v-for="game in pub"
                :key="game.id">
                <md-card-media-cover md-solid @click.native="getGame(game.id, game.slug)">
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
            <div id="load" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="400" >
            </div>
        </div>
    </div>
</template>

<script>

    import {mapGetters} from "vuex";
   // import firebase from "firebase";
    import "@firebase/app";
    import firebase from "@firebase/app";
    import "@firebase/firestore";

    export default {
        data: function() {
            return {
                pub: [],
                page: 0,
                busy: false
            };
        },

        computed: {
            // mappa `this.user` a `this.$store.getters.user`
            ...mapGetters({
                user: "user"
            })
        },

        created: function() {
            console.clear();
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
                    self.pub[elementId].user_game =ris.exists;
                }).catch(function (error) {
                    console.error("Error reading document: ", error);
                });
            },

            addFavs(gameId, userId,elementId) {
                let id = "".concat(userId).concat("-").concat(gameId);
                let db = firebase.firestore();
                this.checkFavs(gameId, userId,elementId);
                let self=this;

                if(this.pub[elementId].user_game)
                {
                    db.collection("favourites").doc(id).delete().then(function () {
                        console.log("Document successfully deleted!");
                        self.pub[elementId].user_game = false;

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
                        self.pub[elementId].user_game = true;
                    }).catch(function (error) {
                        console.error("Error adding document: ", error);
                    });

                }

            },
            loadMore() {
                this.busy = true;
                this.page += 1;
                const axios = require("axios");
                let url="https://api.rawg.io/api/games?page=".concat(this.page).concat("&publishers=").concat(this.$route.params.id);
                axios.get(url).then((response)=>{
                    this.pub = this.pub.concat(response.data.results);
                    this.dev.forEach(el => {
                        this.checkFavs(el.id,this.user.data.email,this.dev.indexOf(el))
                    });
                    this.busy = false;
                })
                .catch((error)=>{
                    this.busy = false;
                    console.log(error);
                });
                this.$forceUpdate();
            }
        }
    };
</script>