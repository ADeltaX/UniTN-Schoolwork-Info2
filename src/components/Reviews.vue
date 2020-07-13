<template>
    <div v-if="!this.$g.pageLoading" v-bind:class="[(revs.length === 0 || !user.loggedIn) ? 'centered-container' : '']">
        <md-empty-state v-if="!user.loggedIn"
            md-icon="rate_review"
            md-label="Accedi per vedere le tue recensioni!"
            md-description="Accedendo potrai gestire le tue recensioni.">
            <md-button class="md-primary md-raised" @click="foes.goTo($router,'login')">Login</md-button>
        </md-empty-state>

        <md-empty-state v-else-if="revs.length === 0"
            md-icon="rate_review"
            md-label="Nessuna recensione per ora!"
            md-description="Vai al tuo gioco preferito e recensiscilo!">
        </md-empty-state>

        <div v-else-if="!this.$g.pageLoading" style="margin-bottom: 56px">
            <div class="md-layout-item md-size-33 md-medium-size-50 md-xsmall-size-100"
                v-for="rev in revs"
                :key="rev.id">
                <md-card-header>
                    <span class="md-title">
                         {{rev.gameName}}
                        -
                        {{rev.title}}
                    </span>
                </md-card-header>
                <md-card-content v-if="user.loggedIn">
                    <md-card-content>
                        {{rev.text}}
                    </md-card-content>
                </md-card-content>
                <md-card-actions>
                    <!-- debug
                    <md-button
                            class="md-icon-button"
                            @click.stop="debug()">
                        <md-icon>info</md-icon>
                    </md-button>  -->
                    <md-button class="md-icon-button">{{rev.rating}}</md-button>
                            <md-button
                                class="md-icon-button"
                                @click.stop="remRev(rev['game-id'],user.data.email,revs.indexOf(rev))">
                            <md-icon>delete</md-icon>
                        </md-button>
                    <md-button
                            class="md-icon-button"
                            @click.stop="foes.goSpecific($router,{name:'game',params:{id:rev['game-id']}})">
                        <md-icon>arrow_forward</md-icon>
                    </md-button>
                    </md-card-actions>
                </div>
                <!-- <div id="load" v-infinite-scroll="loadMore" infinite-scroll-disabled="this$g.pageLoading" infinite-scroll-distance="10" >
                    </div> -->
        </div>
    </div>
</template>
<script>
    import { mapGetters } from "vuex";

    import "@firebase/app";
    import firebase from "@firebase/app";
    import "@firebase/firestore";
    import foes from "../foes.js"

    export default {
        computed: {
            // mappa `this.user` a `this.$store.getters.user`
            ...mapGetters({
                user: "user"
            })
        },

        data() {
            return {
                revs: [],
                foes

            };
        },

        created() {
            console.clear();
            if (this.user.loggedIn)
                this.load(this.user.data.email);

            this.$forceUpdate();
        },

        methods: {

            debug(){
              console.log(this.revs);
            },

            load(userId) {
                this.$g.pageLoading = true;
                let self = this;
                let db = firebase.firestore();
                db.collection("reviews").where("user-id", "==", userId).get().then(function(doc) {
                    //  console.log(doc);
                    if (!doc.empty) {
                        self.revs = doc.docs.map(doc => doc.data());

                        //aggiungo il titolo del gioco alle reviews
                        self.revs.forEach(function (element) {
                            const axios = require("axios");
                            let url = "https://api.rawg.io/api/games/".concat(element['game-id']);
                            axios.get(url).then((response) => {
                                //console.log(response);
                                element.gameName = response.data.name;
                                self.$forceUpdate()

                            });
                        })


                        self.$g.pageLoading = false;

                      //  console.log(self.revs);
                      }
                    else
                        {
                        self.$g.pageLoading = false;
                        console.log("No reviews");
                    }
                }).catch(function(error) {
                    self.$g.pageLoading = false;
                    console.log("Error getting document:", error);
                });

            },

            remRev(gameId, userId,elementId) {
                let id = "".concat(userId).concat("-").concat(gameId);
                let db = firebase.firestore();

                let self = this;
               // console.log(self.revs[elementId]);

                db.collection("reviews").doc(id).delete().then(function () {
                    console.log("Review successfully deleted!");
                    self.revs.splice(elementId,1); // cancella il gioco dall'array
                    self.$forceUpdate();

                }).catch(function (error) {
                    console.error("Error removing review: ", error);
                });
            }


        }
    };
</script>
<style lang="scss" scoped>
    .md-card {
        width: fit-content;
        height: fit-content;
        margin: 4px;
        display: inline-block;
        vertical-align: top;
    }
</style>
