<template>
    <div style="position: relative; height: 100%">
        <div v-if="busy" style="position: absolute; width: 100%; z-index: 100;">
            <md-progress-bar class="md-accent" md-mode="indeterminate"></md-progress-bar>
        </div>
        <div v-else v-bind:class="[(revs.length == 0 || !user.loggedIn) ? 'centered-container' : '']">
            <md-empty-state v-if="!user.loggedIn"
                md-icon="rate_review"
                md-label="Login to see your reviews!"
                md-description="By logging in, you'll be able to write reviews and to edit them.">
                <md-button class="md-primary md-raised" @click="goTo('login')">Login</md-button>
            </md-empty-state>

            <md-empty-state v-else-if="revs.length == 0"
                md-icon="rate_review"
                md-label="No reviews yet!"
                md-description="Go to your favourite game a write a good review about it :)">
            </md-empty-state>

            <div class="md-layout md-gutter" v-else-if="!busy"  style="margin-bottom: 56px">
                <div
                    class="md-layout-item md-size-33 md-medium-size-50 md-xsmall-size-100"
                    v-for="rev in revs"
                    :key="rev.id">
                    <md-card-header>
                        <span class="md-title">
                            {{rev.title}}
                        </span>
                    </md-card-header>
                    <md-card-content v-if="user.loggedIn">
                        <md-card-content>
                            {{rev.text}}
                        </md-card-content>
                    </md-card-content>
                    <md-card-actions>
                        <template>
                        <md-icon>thumb_up</md-icon>
                        {{rev.upvotes}}
                        </template>

                        <md-icon>thumb_down</md-icon>
                        {{rev.downvotes}}

                        <md-button class="md-icon-button">{{rev.rating}}</md-button>
                        <md-button
                                class="md-icon-button"
                                @click.stop="remRev(rev.id,user.data.email,revs.indexOf(rev))">
                            <md-icon>delete</md-icon>
                        </md-button>

                    </md-card-actions>
                </div>
                <!-- <div id="load" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10" >
                    </div> -->
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

        data() {
            return {
                revs: [],
                busy: false
            };
        },

        created() {
            if (this.user.loggedIn)
                this.load(this.user.data.email);
            this.$forceUpdate();
        },

        methods: {
            load(userId) {
                this.busy = true;
                let self = this;
                let db = firebase.firestore();
                db.collection("reviews").where("user-id", "==", userId).get().then(function(doc) {
                    //  console.log(doc);
                    if (!doc.empty) {
                        self.revs = doc.docs.map(doc => doc.data());
                        self.busy = false;
                    } else {
                        console.log("No reviews");
                    }
                }).catch(function(error) {
                    console.log("Error getting document:", error);
                });
            },

            remRev(gameId, userId,elementId) {
                let id = "".concat(userId).concat("-").concat(gameId);
                let db = firebase.firestore();

                let self = this;

                db.collection("reviews").doc(id).delete().then(function () {
                    console.log("Review successfully deleted!");
                    self.revs.splice(elementId,1); // cancella il gioco dall'array
                    self.$forceUpdate();

                }).catch(function (error) {
                    console.error("Error removing review: ", error);
                });
            },

            goTo(x) {
                this.$router.push({
                    name: x
                });
            }
        }
    };
</script>

<style lang="scss" scoped>
    .md-app {
        max-height: 250px;
        border: 1px solid rgba(#000, .12);
    }

    .container {
        width: 450px;
        height: 300px;
        background-size: cover;
        background-repeat: no-repeat;
        background-position: 50% 50%;
        border-radius: 8px;
    }
</style>

