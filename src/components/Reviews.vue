<template>
    <md-empty-state v-if="empty"
                    md-rounded
                    md-icon="favorite"
                    md-label="No reviews yet!"
                    md-description="Dummy text">
    </md-empty-state>
    <div class="md-layout md-gutter" v-else-if="!busy"  style="margin-bottom: 56px">
        <div
                class="md-layout-item md-size-33 md-medium-size-50 md-xsmall-size-100"
                v-for="rev in revs"
                :key="rev.id"
                >
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
        <!--    <div id="load" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10" >
            </div>-->
    </div>
</template>
<script>
    import { mapGetters } from "vuex";

    import firebase from "firebase"
    export default {
        computed: {
            // mappa `this.user` a `this.$store.getters.user`
            ...mapGetters({
                user: "user"
            })
        },
        data: function() {
            return {
                revs: [],
                empty:false,
                busy:false,


            };
        },
        created: function() {
            console.clear();
            this.load(this.user.data.email);
            console.log(this);
            this.$forceUpdate();
        },
        methods: {


            load(userId) {

                this.busy =true;
                let self=this;
                let db = firebase.firestore();
                db.collection("reviews").where("user-id", "==", userId).get().then(function(doc) {
                    //  console.log(doc);
                    if (!doc.empty) {
                        self.revs = doc.docs.map(doc => doc.data());
                        self.busy = false;
                    } else {
                        self.empty = true;
                        console.log("No reviews");
                    }
                }).catch(function(error) {
                    console.log("Error getting document:", error);
                });
            },

            remRev(gameId, userId,elementId) {
                let id = "".concat(userId).concat("-").concat(gameId);
                let db = firebase.firestore();

                let self=this;

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



</style>

