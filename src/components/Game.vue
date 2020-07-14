<template>
    <div class="centered-f-container" v-if="loaded">
        <div class="centered-content">
            <md-card class="md-layout-item">
                <md-card-header>
                    <md-card-header-text>
                        <span class="md-title">
                            {{game.name}}
                        </span>
                        <md-button v-if="user.loggedIn"
                                class="md-icon-button" style="position: absolute; right: 16px;"
                                @click="addFav(game.id, user.data.email)">
                            <md-icon>{{game.user_game ? 'favorite' : 'favorite_border'}}</md-icon>
                        </md-button>
                    </md-card-header-text>
                </md-card-header>
                <md-card-content>
                    <md-table>
                        <md-table-row>
                            <md-table-cell colspan="2">
                                <md-card-media md-big style="width: 100%;">
                                    <video style="width: 100%" autoplay onloadstart="this.volume=0.1"
                                        v-if="game.clip != null" controls>
                                        <source :src="game.clip.clip" type="video/mp4">
                                        Your browser does not support the video tag.
                                    </video>
                                    <img v-else-if="game.background_image != null" :src="game.background_image" alt="Immagine del gioco">
                                    <img v-else src="/img/NoImage.png" alt="Immagine del gioco non presente">
                                </md-card-media>
                            </md-table-cell>
                        </md-table-row>
                        <md-table-row>
                            <md-table-cell>
                                <span v-html="game.description"></span>
                            </md-table-cell>
                        </md-table-row>
                        <md-table-row>
                            <md-table-cell>
                                <a>{{game.website}}</a>
                                <p>Link to stores:</p>
                                <ul>
                                    <li v-for="st in game.stores"
                                        :key="st.id">
                                        <a :href="st.url"> {{st.store.name}} </a>
                                    </li>
                                </ul>
                            </md-table-cell>
                        </md-table-row>
                        <md-table-row>
                            <md-table-cell>
                                <b>Developers: </b>
                                <ul>
                                    <li v-for="devs in game.developers"
                                        :key="devs.id">
                                        {{devs.name}}
                                    </li>
                                </ul>
                            </md-table-cell>
                        </md-table-row>
                        <md-table-row>
                            <md-table-cell>
                                <b>Genres</b>
                                <ul>
                                    <li v-for="gen in game.genres"
                                        :key="gen.id">
                                        {{gen.name}}
                                    </li>
                                </ul>
                            </md-table-cell>
                        </md-table-row>
                        <md-table-row>
                            <md-table-cell>
                                <b>Platforms</b>
                                <ul>
                                    <li v-for="plat in game.platforms"
                                        :key="plat.id">
                                        <pre></pre>
                                        <b> {{plat.platform.name}} </b>
                                        (Release date: {{plat.released_at}})
                                    </li>
                                </ul>
                            </md-table-cell>
                        </md-table-row>
                    </md-table>
                    <br>
                </md-card-content>
            </md-card>
            <md-card v-if="user.loggedIn">
                <md-card-header>
                    <span class="md-title">
                            Scrivi una recensione
                        </span>
                </md-card-header>
                <md-card-content>
                    <template>
                        <form>
                            <md-field>
                                <label>Title</label>
                                <md-input required v-model="review.title" md-counter="30"></md-input>
                            </md-field>

                            <md-field>
                                <label>Score</label>
                                <md-input required value="70" v-model="review.score" type="number" max="100" min="1"></md-input>
                            </md-field>

                            <md-field>
                                <label>Review</label>
                                <md-textarea required v-model="review.text" md-counter="500"></md-textarea>
                            </md-field>
                        </form>
                    </template>
                </md-card-content>
                <md-card-actions>
                    <md-button class="md-raised md-primary" @click="update(user.data.email, game.id)" v-if="rexists">UPDATE</md-button>
                    <md-button class="md-raised md-primary" @click="submit(user.data.email, game.id)" v-else>SUBMIT</md-button>
                </md-card-actions>
            </md-card>
            <md-snackbar md-position="left" :md-active.sync="showSnackbar">
                <span>{{error}}</span>
            </md-snackbar>
            <md-card v-for="rev in reviews"
                    :key="rev.id" style="width: calc(100% - 32px)">
                <md-card-header>
                    <p class="md-subheading" style="text-align: right;">
                        <i>{{rev.username}}</i>
                    </p>
                    <p class="md-title">
                        {{rev.title}}
                    </p>
                </md-card-header>
                <md-card-content>
                    {{rev.text}}
                </md-card-content>
                <md-card-actions>
                    <div>
                        <span class="md-title">{{rev.rating}}</span>
                        <span>/100</span>
                    </div>
                </md-card-actions>
            </md-card>
            <div id="load" v-infinite-scroll="loadMore" infinite-scroll-disabled="this.$g.pageLoading"
                infinite-scroll-distance="10"></div>
        </div>
    </div>
</template>

<script>
    import {mapGetters} from "vuex";
    import "@firebase/app";
    import firebase from "@firebase/app";
    import "@firebase/firestore";
    import foes from "../foes"

    export default {
        data: function () {
            return {
                game: null,
                showSnackbar: false,
                fav: false,
                review: {
                    title: "",
                    score: 60,
                    text: "",
                    username: ""
                },
                rexists: false, //se la review dell'utente esiste o meno
                reviews: [],
                page: 0,
                gid: this.$route.params.id,
                error: null,
                foes,
                loaded: false
            };
        },

        computed: {
            // mappa `this.user` a `this.$store.getters.user`
            ...mapGetters({
                user: "user"
            }),

        },
        
        created() {
            this.$g.pageLoading = true;
            document.title = "Gioco - GameReview";
            const axios = require("axios");

            let url;

            if (this.$route.params.id != null)
                url = "https://api.rawg.io/api/games/".concat(this.$route.params.id);
            else
                this.$router.replace({name: "notFound"});

            console.log(url);
            axios.get(url).then((response) => {
                this.game = response.data;
                this.checkFav(this.gid, this.user.data.email);
                this.loaded = true;
            })
            .catch((error) => {
                console.log(error.response.status); //probably is a HTTP 404...
                this.$router.replace({name: "notFound"});
            });

            if (this.user.loggedIn) {
                let db = firebase.firestore();
                let self = this;
                let id;

                if (this.$route.params.id != null)
                    id = this.user.data.email.concat("-").concat(this.$route.params.id)
                else
                    this.$router.replace({name: "notFound"});

                let doc = db.collection("reviews").doc(id);

                doc.get().then(function (doc) {
                    if (doc.exists) {
                        console.log("review already exists")

                        self.rexists = true;
                    } else {
                        console.log("review does not exists")
                        self.rexists = false;
                    }
                }).catch(function (error) {
                    console.log("Error getting document:", error);
                });
            }

            this.loadMore();
            this.$forceUpdate();
        },

        methods: {
            checkFav(gameId, userId) {

                let id = "".concat(userId).concat('-').concat(gameId);
                let self = this;
                let db = firebase.firestore();
                //controlliamo se è già inserito
                db.collection("favourites").doc(id)
                    .get().then(function (ris) {
                    self.game.user_game = ris.exists;
                    console.log("Game in favs")
                }).catch(function (error) {
                    console.error("Error reading document: ", error);
                });
            },

            addFav(gameId, userId) {
                let id = "".concat(userId).concat("-").concat(gameId);
                let db = firebase.firestore();
                this.checkFav(gameId, userId);
                // console.log(this.dev)
                let self = this;

                if (this.game.user_game) {
                    db.collection("favourites").doc(id).delete().then(function () {
                        console.log("Document successfully deleted!");
                        self.game.user_game = false;
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
                        self.game.user_game = true;
                    }).catch(function (error) {
                        console.error("Error adding document: ", error);
                    });
                }
            },

            submit(userId, gameId) {
                let db = firebase.firestore();
                let id = userId.concat("-").concat(gameId);
                let self = this;

                /* console.error(this.review.title)
                 console.error(this.review.text)*/

                if (this.review.title === "" || this.review.text === "") {
                    this.showSnackbar = true;
                    this.error = "Titolo e descrizione sono obbligatori";
                    console.error("Errore titolo e descrizione")

                    return;
                }
                if (this.review.title.length > 30 || this.review.text.length > 500) {
                    this.showSnackbar = true;
                    this.error = "Titolo e descrizione non devono superare le dimensioni indicate";
                    console.error("Errore titolo e descrizione")

                    return;
                }
                if (this.review.score <= 0 || this.review.score > 100) {
                    this.showSnackbar = true;
                    this.error = "Lo score deve essere compreso tra 0 e 100";
                    console.error("Errore score")
                    //  this.score=60;
                    // this.$forceUpdate();
                    return;
                }

                db.collection("reviews").doc(id).set({
                    "user-id": userId,
                    "game-id": gameId,
                    title: this.review.title,
                    rating: this.review.score,
                    text: this.review.text,
                    upvotes: 0,
                    downvotes: 0

                })
                .then(function () {
                    console.log("Review aggiunta con successo");
                    self.$router.go();
                })
                .catch(function (error) {
                    console.error("Error writing document(review): ", error);
                });
            },

            update(userId, gameId) {
                let db = firebase.firestore();
                let id = userId.concat("-").concat(gameId);
                let doc = db.collection("reviews").doc(id);
                let self = this;

                if (this.review.title === "" || this.review.text === "") {
                    this.showSnackbar = true;
                    this.error = "Titolo e descrizione sono obbligatori";
                    console.error("Errore titolo e descrizione")

                    return;
                }
                if (this.review.title.length > 30 || this.review.text.length > 500) {
                    this.showSnackbar = true;
                    this.error = "Titolo e descrizione non devono superare le dimensioni indicate";
                    console.error("Errore titolo e descrizione")

                    return;
                }
                if (this.review.score <= 0 || this.review.score > 100) {
                    this.showSnackbar = true;
                    this.error = "Lo score deve essere compreso tra 0 e 100";
                    console.error("Errore score")
                    //  this.score=60;
                    // this.$forceUpdate();
                    return;
                }

                return doc.update({
                    title: this.review.title,
                    rating: this.review.score,
                    text: this.review.text
                })
                .then(function() {
                    console.log("Review successfully updated!");
                    self.$router.go();
                })
                .catch(function(error) {

                    console.error("Error updating review: ", error);
                });
            },

            loadMore() {
                //console.log("Adding more data results");
                this.$g.pageLoading = true;
                let db = firebase.firestore();
                let self = this;

                let id;
                if (this.$route.params.id != null)
                    id = self.$route.params.id
                else
                    this.$router.replace({name: "notFound"});

                //  console.log(id);
                //     console.log(self.page);
                //    console.log(db.collection("reviews").where("game-id", "==", parseInt(id)).get())


                db.collection("reviews").where("game-id", "==", parseInt(id)).limit(10).orderBy("upvotes").startAt(self.page).get().then(function (doc) {
                    //console.log(doc);
                    if (!doc.empty) {
                        self.reviews = doc.docs.map(doc => doc.data());
                        //aggiungo lo username alle reviews
                        self.reviews.forEach(function (element) {
                            db.collection("users").doc(element["user-id"]).get().then(
                                function (doc) {
                                    let data = doc.data();
                                    element.username = data['username'];
                                    self.$forceUpdate()
                                }
                            )
                        });

                        self.page += 10;
                        self.$g.pageLoading = false;
                        console.log(self.reviews)
                    } else {
                        // doc.data() will be undefined in this case
                        console.log("No reviews");
                        self.$g.pageLoading = false;
                    }
                }).catch(function (error) {
                    console.log("Error getting document:", error);

                    self.$g.pageLoading = false;
                });


            }

        }
    };
</script>

<style scoped>
    .md-card {
        width: fit-content;
        height: fit-content;
        margin: 4px;
        display: inline-block;
        vertical-align: top;
        width: calc(100% - 32px);
    }

    .centered-f-container {
        width: 100%;     
    }
    .centered-content {
        max-width: 1200px;
        margin: 0 auto;
        margin-bottom: 24px;
        width: 100%
    }
</style>