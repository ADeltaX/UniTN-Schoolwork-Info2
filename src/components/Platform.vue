<template>
    <div class="md-layout md-gutter" style="margin-bottom: 56px">
        <div
                class="md-layout-item md-size-33 md-medium-size-50 md-xsmall-size-100"
                v-for="game in games"
                :key="game.id"
                @click="getGame(game.id)"
        >
            <md-card md-with-hover>
                <md-card-media-cover md-solid>
                    <md-card-media md-big>
                        <div class="container" :style='{ backgroundImage: "url(" + game.short_screenshots[0].image + ")", }'></div>
                    </md-card-media>

                    <md-card-area>
                        <md-card-header>
                            <span class="md-title">{{game.name}}</span>
                        </md-card-header>
                        <md-card-actions v-if="user.loggedIn">
                              <span>
                                <md-button
                                        class="md-icon-button"
                                        @click.stop="changeFavorite(game),showSnackbarTrue=true, showSnackbarFalse=true"
                                >
                                  <md-icon v-if="user.loggedIn">{{(game.user_game) ? 'favorite' : 'favorite_border'}}</md-icon>
                                </md-button>
                              </span>
                        </md-card-actions>
                    </md-card-area>

                </md-card-media-cover>
            </md-card>

            <md-snackbar
                    md-position="center"
                    :md-duration="1000"
                    :md-active.sync="showSnackbarTrue"
                    v-if="game.user_game == true"
            >
                <span>Inserted in favorites!</span>
            </md-snackbar>
            <md-snackbar
                    md-position="center"
                    :md-duration="1000"
                    :md-active.sync="showSnackbarFalse"
                    v-if="game.user_game == true"
            >
                <span>Remove from favorites!</span>
            </md-snackbar>
        </div>
        <div id="load" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10" >
        </div>
    </div>
</template>

<script>

    import {mapGetters} from "vuex";

    export default {
        data: function() {
            return {
                games: [],
                showSnackbar: false,
                showSnackbarTrue: false,
                showSnackbarFalse: false,
                page:0
            };
        },
        computed: {
            // mappa `this.user` a `this.$store.getters.user`
            ...mapGetters({
                user: "user"
            })
        },
        created: function() {
            this.loadMore();
            this.$forceUpdate();
        },
        methods: {

            goBack: function() {
                this.$router.back();
            },
            getGame(id) {
                this.$router.push({ name: 'game', params: { id } })
            },
            loadMore() {
                this.busy = true;
                this.page += 1;
                const axios = require("axios");
                let url="https://api.rawg.io/api/games?page=".concat(this.page).concat("&platforms=").concat(this.$route.params.id);
                axios.get(url).then((response)=>{
                    this.games = this.games.concat(response.data.results);
                    this.busy = false;
                    //console.log(response)
                })
                    .catch((error)=>{
                        console.log(error)
                    });
                this.loading = false;
                this.$forceUpdate();


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

    .md-card-area {
        backdrop-filter: blur(32px);
        border-radius: 0 0 8px 8px;
    }

</style>