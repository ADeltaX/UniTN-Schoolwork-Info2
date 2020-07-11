<template>
    <div>
        <div v-if="busy" style="position: absolute; width: 100%; z-index: 100;">
            <md-progress-bar class="md-accent" md-mode="indeterminate"></md-progress-bar>
        </div>
        <div class="flex-container" style="margin-bottom: 24px">
            <md-card md-with-hover v-for="game in devs"
                :key="game.id">
                <md-card-media-cover md-solid @click.native="getGame(game.id, game.slug)">
                    <md-card-media md-big>
                        <div class="img-container" :style='{ backgroundImage: "url(" + game.image_background + ")", }'></div>
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
    import { mapGetters } from "vuex";
    export default {
        computed: {
            // mappa `this.user` a `this.$store.getters.user`
            ...mapGetters({
                user: "user"
            })
        },
        data: function() {
            return {
                devs: [],
                offset: 0,
                busy: false,
                showSnackbarTrue: false,
                showSnackbarFalse: false,
                page:1
            };
        },
        created: function() {
                    this.loadMore();
                    this.$forceUpdate();
                },
        methods: {

            getGame(id,slug) {
                this.$router.push({ name: 'dev', params: { id,slug } })
            },
            loadMore() {
                this.busy = true;
                this.page += 1;
                const axios = require("axios");
                let url="https://api.rawg.io/api/developers?page=".concat(this.page);
                axios.get(url).then((response)=>{
                    this.busy = false;
                    this.devs = this.devs.concat(response.data.results);
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