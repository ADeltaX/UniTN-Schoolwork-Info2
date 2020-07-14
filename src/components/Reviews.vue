<template>
    <div v-if="!this.$g.pageLoading" v-bind:class="[(revs.length === 0 || !user.loggedIn) ? 'centered-container' : '']">
        <md-empty-state v-if="!user.loggedIn"
                        md-icon="rate_review"
                        md-label="Accedi per vedere le tue recensioni!"
                        md-description="Accedendo potrai gestire le tue recensioni.">
            <md-button class="md-primary md-raised" @click="foes.goTo($router, 'login')">Login</md-button>
        </md-empty-state>

        <md-empty-state v-else-if="revs.length === 0"
                        md-icon="rate_review"
                        md-label="Nessuna recensione per ora!"
                        md-description="Vai al tuo gioco preferito e recensiscilo!">
        </md-empty-state>

        <div v-else-if="!this.$g.pageLoading" class="flex-container">
            <div v-for="rev in revs"
                 :key="rev.id">
                <md-card style="height: 360px;">
                    <md-card-header>
                        <span class="md-title">
                            {{rev.title}}
                        </span>
                        -
                        <span class="md-subheading">
                            {{rev.gameName}}
                        </span>
                    </md-card-header>
                    <md-card-content>
                        <md-card-content style="overflow: hidden; min-height: 60px; max-height: 200px;">
                            {{rev.text}}
                        </md-card-content>
                    </md-card-content>
                    <md-card-actions style="position: absolute; bottom: 0; right: 0; align: right;">
                        <div>
                            <span>VOTO: </span>
                            <span class="md-title">{{rev.rating}}</span>
                            <span>/100</span>
                        </div>
                        <md-button
                                class="md-icon-button"
                                @click.stop="remRev(rev['game-id'], user.data.email, revs.indexOf(rev))">
                            <md-icon>delete</md-icon>
                        </md-button>
                        <md-button
                                class="md-icon-button"
                                @click.stop="foes.goSpecific($router, { name: 'game', params: { id: rev['game-id'] } })">
                            <md-icon>arrow_forward</md-icon>
                        </md-button>
                    </md-card-actions>
                </md-card>
            </div>
        </div>
    </div>
</template>
<script>
    import {mapGetters} from "vuex";

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
            document.title = "Recensioni - Game Review";

            if (this.user.loggedIn)
                this.load(this.user.data.email);

            this.$forceUpdate();
        },

        methods: {
            load(userId) {
                this.$g.pageLoading = true;
                let self = this;
                let db = firebase.firestore();
                db.collection("reviews").where("user-id", "==", userId).get().then(function (doc) {
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
                                self.$forceUpdate();
                            });
                        })

                        self.$g.pageLoading = false;

                    } else {
                        self.$g.pageLoading = false;
                        console.log("No reviews");
                    }
                }).catch(function (error) {
                    self.$g.pageLoading = false;
                    console.log("Error getting document:", error);
                });

            },

            remRev(gameId, userId, elementId) {
                if (confirm("Vuoi veramente cancellare la recensione?")) {
                    let id = "".concat(userId).concat("-").concat(gameId);
                    let db = firebase.firestore();

                    let self = this;

                    db.collection("reviews").doc(id).delete().then(function () {
                        console.log("Review successfully deleted!");
                        self.revs.splice(elementId, 1); // cancella il gioco dall'array
                        self.$forceUpdate();

                    }).catch(function (error) {
                        console.error("Error removing review: ", error);
                    });
                }
            }
        }
    };
</script>