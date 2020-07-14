<template>
    <div>
        <div>
            <h1 class="md-headline">Sviluppatore: {{ devName }}</h1>
        </div>
        <div class="flex-container">
            <md-card md-with-hover v-for="game in dev"
                     :key="game.id">
                <router-link :to="`/game/${game.id}/`">
                    <md-card-media-cover md-solid>
                        <md-card-media md-big>
                            <div class="img-container"
                                 :style='{ backgroundImage: "url(" + foes.getResizedImage(game.background_image) + ")", }'></div>
                        </md-card-media>
                        <md-card-area>
                            <md-card-header>
                                <span class="md-title">{{game.name}}</span>
                            </md-card-header>
                            <md-card-actions v-if="user.loggedIn">
                                <span>
                                    <md-button
                                            class="md-icon-button" @click.prevent
                                            @click="addFavs(game.id, user.data.email, dev.indexOf(game))">
                                        <md-icon>{{game.user_game ? 'favorite' : 'favorite_border'}}</md-icon>
                                    </md-button>
                                </span>
                            </md-card-actions>
                        </md-card-area>
                    </md-card-media-cover>
                </router-link>
            </md-card>
            <div id="load" v-infinite-scroll="loadMore" infinite-scroll-disabled="this.$g.pageLoading"
                 infinite-scroll-distance="400"></div>
        </div>
    </div>
</template>

<script>
    import {mapGetters} from "vuex";
    import "@firebase/app";
    import firebase from "@firebase/app";
    import "@firebase/firestore";
    import foes from "../foes";

    export default {
        data: function () {
            return {
                dev: [],
                devName: "",
                page: 0,
                canLoadMore: true,
                foes
            };
        },

        computed: {
            // mappa `this.user` a `this.$store.getters.user`
            ...mapGetters({
                user: "user"
            })
        },

        async created() {
            document.title = "Sviluppatore - GameReview";
            this.devName = await foes.getTitleName("https://api.rawg.io/api/developers/", this.$route.params.id);

            if (this.devName == null) //è successo qualcosa, quindi (per ultra semplificazione), gestiamo un solo errore e rimandiamo al 404
                await this.$router.replace({name: "notFound"});
        },

        methods: {
            checkFavs(gameId, userId, elementId) {
                let id = "".concat(userId).concat('-').concat(gameId);
                let self = this;
                let db = firebase.firestore();
                //controlliamo se è già inserito
                db.collection("favourites").doc(id)
                    .get().then(function (ris) {
                    self.dev[elementId].user_game = ris.exists;
                }).catch(function (error) {
                    console.error("Error reading document: ", error);
                });

            },

            addFavs(gameId, userId, elementId) {
                let id = "".concat(userId).concat("-").concat(gameId);
                let db = firebase.firestore();
                this.checkFavs(gameId, userId, elementId);
                let self = this;

                if (this.dev[elementId].user_game) {
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
                if (!this.canLoadMore)
                    return;

                this.$g.pageLoading = true;
                this.page++;
                const axios = require("axios");
                let url = "https://api.rawg.io/api/games?page=".concat(this.page).concat("&developers=").concat(this.$route.params.id);

                axios.get(url).then((response) => {
                    this.dev = this.dev.concat(response.data.results);
                    if (this.user.loggedIn) {
                        this.dev.forEach(el => {
                            this.checkFavs(el.id, this.user.data.email, this.dev.indexOf(el));
                        });
                    }

                    this.$g.pageLoading = false;

                    if (response.data.next == null)
                        this.canLoadMore = false;
                })
                    .catch((error) => {
                        if (error.response) {
                            //Let's suppose it's a 404 (we may have a gateway error, auth error, etc.... but that's not a problem for the moment)
                            // this.$router.replace({ name: "notFound" });
                        }

                        this.page--;
                        this.$g.pageLoading = false;
                        console.log(error);
                    });

                this.$forceUpdate();
            }
        }
    };
</script>