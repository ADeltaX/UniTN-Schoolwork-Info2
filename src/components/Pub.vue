<template>
    <div class="md-layout md-gutter">
        <div
                class="md-layout-item md-size-33 md-medium-size-50 md-xsmall-size-100"
                v-for="game in pub"
                :key="game.id"
                @click="getGame(game.id)"
        >
            <md-card md-with-hover>
                <md-card-media-cover md-solid>
                    <md-card-media md-big>
                        <img :src="game.background_image">
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
        <div id="load">
            <md-button
                    class="md-accent md-raised md-large-size-20 md-medium-size-33 md-small-size-50 md-xsmall-size-100"
                    @click="loadMore()"
            >Load more</md-button>

        </div>
    </div>
</template>

<script>

    import {mapGetters} from "vuex";

    export default {
        data: function() {
            return {
                pub: null,
                showSnackbar: false,
                showSnackbarTrue: false,
                showSnackbarFalse: false,
                page:1
            };
        },
        computed: {
            // mappa `this.user` a `this.$store.getters.user`
            ...mapGetters({
                user: "user"
            })
        },
        created: function() {

            const axios = require("axios");
            // console.log("response:");
            let url = "https://api.rawg.io/api/games?publishers=".concat(this.$route.params.id);
            axios.get(url).then((response)=>{
                this.pub = response.data.results;
                console.log(response);

            })
                .catch((error)=>{
                    console.log(error)
                })

        },
        methods: {

            goBack: function() {
                this.$router.back();
            },
            getGame(id) {
                this.$router.push({ name: 'game', params: { id } })
            },
            loadMore() {
                this.loading = true;
                this.page += 1;
                const axios = require("axios");
                let url="https://api.rawg.io/api/games?page=".concat(this.page).concat("&publishers=").concat(this.$route.params.id);
                axios.get(url).then((response)=>{
                    this.pub = this.pub.concat(response.data.results);
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
