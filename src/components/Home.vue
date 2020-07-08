<template>
    <div class="md-layout md-gutter" >
        <div
                class="md-layout-item md-size-33 md-medium-size-50 md-xsmall-size-100"
                v-for="game in games"
                :key="game.id"
                @click="getGame(game.id)"
        >
            <md-card md-with-hover>
                <md-card-media-cover md-solid>
                    <md-card-media md-big>
                        <img :src="game.short_screenshots[0].image" >
                    </md-card-media>

                    <md-card-area>
                        <md-card-header>
                            <span class="md-title">{{game.name}}</span>
                        </md-card-header>

                        <md-card-actions>
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
                games: [],
                showSnackbarTrue: false,
                showSnackbarFalse: false,
                page:0,
                busy:false
            };
        },
        created: function() {
            this.loadMore();
            this.$forceUpdate();
        },
        methods: {

            getGame(id) {
                this.$router.push({ name: 'game', params: { id } })
            },
            loadMore() {
                //console.log("Adding more data results");
                this.busy = true;

                this.page += 1;
                const axios = require("axios");
                let url="https://api.rawg.io/api/games?page=".concat(this.page);
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
        max-height: 400px;
        border: 1px solid rgba(#000, .12);
    }

    // Demo purposes only
    .md-drawer {
        width: 230px;
        max-width: calc(100vw - 125px);
    }

    .md-card {
        width: 450px;
        height: auto;
        margin: 4px;
        display: inline-block;
        vertical-align: top;
    }
    .img{
        height: auto;
        width: auto;
        max-width: 450px;
        max-height: 250px;
       //min-height: 250px;

        //controllare se si può sistemare
    }




</style>