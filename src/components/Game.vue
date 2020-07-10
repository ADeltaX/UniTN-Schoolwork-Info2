<template>
    <div class="md-layout">
        <md-card class="md-layout-item" >
            <md-card-header>
                <md-card-header-text>
                    <span class="md-title">
                        {{game.name}}
                    </span>
                </md-card-header-text>
            </md-card-header>
            <md-card-content>
                <md-table>
                    <md-table-row>
                        <md-table-cell>
                            <b>Description</b>
                        </md-table-cell>
                        <md-table-cell><span v-html="game.description"></span></md-table-cell>
                    </md-table-row>
                    <md-table-row>
                        <md-table-cell>
                            <b>Developers</b>
                        </md-table-cell>
                        <md-table-cell>
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
                        </md-table-cell>
                        <md-table-cell>
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
                        </md-table-cell>
                        <md-table-cell>
                            <ul>
                                <li v-for="plat in game.platforms"
                                    :key="plat.id">
                                    {{plat.platform.name}}
                                    <pre></pre>
                                    <strong>Release date</strong>:
                                    {{plat.released_at}}
                                </li>
                            </ul>
                        </md-table-cell>
                    </md-table-row>
                    <md-table-row>
                        <md-table-cell>
                            <md-card-media md-big >
                                <video width="1920" height="1080" autoplay onloadstart="this.volume=0.1" v-if="game.clip != null">
                                    <source :src="game.clip.clip" type="video/mp4">
                                    Your browser does not support the video tag.
                                </video>
                                <img v-else :src="game.background_image" >
                            </md-card-media>
                        </md-table-cell>
                        <md-table-cell>
                            <a>{{game.website}}</a>
                            <ul>
                                <li v-for="st in game.stores"
                                    :key="st.id">
                                    {{st.store.name}}:{{st.url}}
                                </li>
                            </ul>

                        </md-table-cell>
                    </md-table-row>
                </md-table>
                <br>

            </md-card-content>
            <md-card-actions>
                <!-- TODO;fixare il goBack -->
                <md-button class="md-icon-button" @click="goBack()">
                    <md-icon>fast_rewind</md-icon>
                </md-button>
            </md-card-actions>

        </md-card>
        <md-card v-if="user.loggedIn" class="md-layout-item">
            <md-card-header>
                <span class="md-title">
                        Scrivi una recensione
                    </span>
            </md-card-header>
            <md-card-content >
                <template>
                    <form>
                        <md-field>
                            <label>Title</label>
                            <md-input v-model="review.title" md-counter="30"></md-input>
                        </md-field>

                        <md-field>
                            <label>Score</label>
                            <md-input v-model="review.score" type="number" max="100" min="1"></md-input>
                        </md-field>

                        <md-field>
                            <label>Review</label>
                            <md-textarea v-model="review.text" md-counter="500"></md-textarea>
                        </md-field>


                    </form>
                </template>
            </md-card-content>
            <md-card-actions>
                <md-button class="md-raised" type="reset">RESET</md-button>
                <md-button class="md-raised" @click="update(user.data.email,game.id)" v-if="rexists">UPDATE</md-button>
                <md-button class="md-raised" @click="submit(user.data.email,game.id)" v-else>SUBMIT</md-button>
            </md-card-actions>

        </md-card>
        <md-card  v-for="rev in reviews"
                 :key="rev.id">
            <md-card-header>
                <span class="md-title">
                        {{rev.title}}
                    </span>
            </md-card-header>
            <md-card-content >

                    {{rev.text}}

            </md-card-content>
            <md-card-actions>
                {{rev.rating}}
            </md-card-actions>

        </md-card>
        <div id="load" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10" ></div>

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
                game: null,
                showSnackbar: false,
                showSnackbarTrue: false,
                showSnackbarFalse: false,
                review:{
                    title:"",
                    score:0,
                    text:""
                },
                rexists:false, //se la review dell'utente esiste o meno
                reviews:[],
                busy:false,
                page:0,
                gid: this.$route.params.id

            };
        },
        computed: {
            // mappa `this.user` a `this.$store.getters.user`
            ...mapGetters({
                user: "user"
            }),

        },
        created: function() {
            const axios = require("axios");

            // register, i.e. in a `mounted` hook
            window.addEventListener('unload', this.onReload);

            let url = "https://api.rawg.io/api/games/".concat(this.$route.params.id);
            console.log(url);
            axios.get(url).then((response)=>{
                this.game = response.data;
                //console.log(response);


            })
                .catch((error)=>{
                    console.log(error)
                });
            this.$forceUpdate();
            let db = firebase.firestore();
            let self=this;
            let id = this.user.data.email.concat("-").concat(this.$route.params.id)
            let doc = db.collection("reviews").doc(id);
           // console.log("this:");
            //console.log(this);
            doc.get().then(function(doc) {
                if (doc.exists) {
                    console.log("review already exists")

                    self.rexists=true;
                } else {
                    console.log("review does not exists")
                    self.rexists=false;
                }
            }).catch(function(error) {
                console.log("Error getting document:", error);
            });
            this.loadMore();
            this.$forceUpdate();

        },
        methods: {

            goBack: function() {
                this.$router.back();
            },
            onReload(){
               let id=this.gid.toString();

                this.$router.push({ name: 'game', params: { id }});
            },
            submit(userId,gameId){
                let db = firebase.firestore();
                let id = userId.concat("-").concat(gameId);
                let self = this;
                db.collection("reviews").doc(id).set({
                    "user-id": userId,
                    "game-id": gameId,
                    title:this.review.title,
                    rating:this.review.score,
                    text:this.review.text,
                    upvotes:0,
                    downvotes:0

                })
                    .then(function() {
                        console.log("Review aggiunta con successo");
                        self.$forceUpdate();
                    })
                    .catch(function(error) {
                        console.error("Error writing document(review): ", error);
                    });
            },
           /*- checkReview(userId,gameId){
                let db = firebase.firestore();
                let id = userId.concat("-").concat(gameId)
                let doc = db.collection("reviews").doc(id);

                doc.get().then(function(doc) {
                    if (doc.exists) {
                        console.log("review already exists")
                        this.rexists=true;
                    } else {
                        console.log("review does not exists")
                        this.rexists=false;
                    }
                }).catch(function(error) {
                    console.log("Error getting document:", error);
                });

            },*/
            update(userId,gameId)
            {
                let db = firebase.firestore();
                let id = userId.concat("-").concat(gameId);
                let doc = db.collection("reviews").doc(id);


                return doc.update({
                    title:this.review.title,
                    rating:this.review.score,
                    text:this.review.text
                })
                    .then(function() {
                        console.log("Review successfully updated!");
                    })
                    .catch(function(error) {

                        console.error("Error updating review: ", error);
                    });
            },
            loadMore() {
                //console.log("Adding more data results");
                this.busy = true;
                let db = firebase.firestore();
                let self=this;


                db.collection("reviews").where("game-id", "==", self.$route.params.id).limit(10).orderBy("upvotes").startAt(self.page).get().then(function(doc) {
                    console.log(doc);
                    if (!doc.empty) {
                       self.reviews = doc.docs.map(doc => doc.data());
                       self.page +=10;
                       self.busy = false;
                       console.log(self.reviews)
                    } else {
                        // doc.data() will be undefined in this case
                        console.log("No reviews");
                    }
                }).catch(function(error) {
                    console.log("Error getting document:", error);
                });


            }

        }
    };
</script>
<style lang="scss" scoped>
    .md-card {
        width: 320px;
        margin: 4px;
        display: inline-block;
        vertical-align: top;
    }
</style>