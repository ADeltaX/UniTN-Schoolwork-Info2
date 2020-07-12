<template>
    <div>
        <div v-if="busy" style="position: absolute; width: 100%; z-index: 100;">
            <md-progress-bar class="md-accent" md-mode="indeterminate"></md-progress-bar>
        </div>
        <div class="flex-container" style="margin-bottom: 24px">
            <md-card md-with-hover v-for="game in games"
                :key="game.id">
                <md-card-media-cover md-solid @click.native="getGame(game.id, game.slug)">
                    <md-card-media md-big>
                        <div class="img-container" :style='{ backgroundImage: "url(" + getResizedImage(game.background_image) + ")", }'></div>
                    </md-card-media>
                    <md-card-area>
                        <md-card-header>
                            <span class="md-title">{{game.name}}</span>
                        </md-card-header>
                        <md-card-actions v-if="user.loggedIn">
                            <span>
                                <md-button class="md-icon-button"
                                        @click.stop="addFavs(game.id, user.data.email, games.indexOf(game))">
                                    <md-icon>{{game.user_game ? 'favorite' : 'favorite_border'}}</md-icon>
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
    import { mapGetters } from "vuex";
    import "@firebase/app";
    import firebase from "@firebase/app";
    import "@firebase/firestore";
    import ls from "local-storage"


    export default {
        computed: {
            // mappa `this.user` a `this.$store.getters.user`
            ...mapGetters({
                user: "user"
            })
        },
        data() {
            return {
                games: [],
                page: 0,
                busy: false,
                canLoadMore: true
            };
        },
        
        created() {
          //  console.clear();
            this.loadMore();
            this.$forceUpdate();
        },

        methods: {
            getResizedImage(url, size = 640){
                //Ci serve per forza altrimenti siamo costretti a caricare nel DOM immagini a 1920x1080 per un lag garantito
                if (url == null) //Capita che il server risponda con null
                    return null;

                return url.replace("https://media.rawg.io/media/", "https://media.rawg.io/media/resize/" + size + "/-/");
            },

            getGame(id,slug) {
                ls("gameId",id)
                ls("gameSlug",slug)
                this.$router.push({ name: 'game', params: { id, slug } })
            },

            loadMore() {
                //console.log("Adding more data results");
                if (!this.canLoadMore)
                    return;

                this.busy = true;

                this.page += 1;
                const axios = require("axios");
                let url="https://api.rawg.io/api/games?page=".concat(this.page);
                axios.get(url).then((response) => {
                    this.games = this.games.concat(response.data.results);
                    this.games.forEach(el => {
                        if (this.user.loggedIn)
                            this.checkFavs(el.id, this.user.data.email, this.games.indexOf(el));
                    });

                    this.busy = false;

                    if (response.data.next == null)
                        this.canLoadMore = false;
                })
                .catch((error) => {
                    this.page--;
                    console.log(error);
                    this.busy = false;
                });
                this.$forceUpdate();
            },

            checkFavs(gameId, userId,elementId) {
                let id = "".concat(userId).concat('-').concat(gameId);
                let self=this;
                let db = firebase.firestore();
                
                //controlliamo se è già inserito
                db.collection("favourites").doc(id)
                    .get().then(function (ris) {
                        self.games[elementId].user_game = ris.exists;
                    }).catch(function (error) {
                    console.error("Error reading document: ", error);
                });
            },

            addFavs(gameId, userId,elementId) {
                let id = "".concat(userId).concat("-").concat(gameId);
                let db = firebase.firestore();
                this.checkFavs(gameId, userId,elementId);
                let self=this;

                if(this.games[elementId].user_game) {
                    db.collection("favourites").doc(id).delete().then(function () {
                        console.log("Document successfully deleted!");
                        self.games[elementId].user_game = false;
                    })
                    .catch(function (error) {
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