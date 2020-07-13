<template>
    <div>
        <div>
            <h1 class="md-headline">Sviluppatori</h1>
        </div>
        <div class="flex-container">
            <md-card md-with-hover v-for="game in devs"
                :key="game.id">
                <router-link :to="`/dev/${game.id}/`">
                    <md-card-media-cover md-solid>
                        <md-card-media md-big>
                            <div class="img-container" :style='{ backgroundImage: "url(" + self.getResizedImage(game.image_background) + ")", }'></div>
                        </md-card-media>
                        <md-card-area>
                            <md-card-header>
                                <span class="md-title">{{game.name}}</span>
                            </md-card-header>
                        </md-card-area>
                    </md-card-media-cover>
                </router-link>
            </md-card>
            <div id="load" v-infinite-scroll="loadMore" infinite-scroll-disabled="this.$g.pageLoading" infinite-scroll-distance="400" >
            </div>
        </div>
    </div>
</template>
<script>
    import { mapGetters } from "vuex";
    import foes from "../foes"
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
                page: 1,
                canLoadMore: true,
                foes
            };
        },

        created: function() {
            console.clear();
        },

        methods: {

            loadMore() {
                if (!this.canLoadMore)
                    return;

                this.$g.pageLoading = true;
                this.page++;
                const axios = require("axios");
                let url="https://api.rawg.io/api/developers?page_size=20&page=".concat(this.page);
                axios.get(url).then((response) => {
                    this.devs = this.devs.concat(response.data.results);
                    this.$g.pageLoading = false;

                    if (response.data.next == null)
                        this.canLoadMore = false;
                })
                .catch((error) => {
                    this.page--;
                    this.$g.pageLoading = false;
                    console.log(error);
                });
                this.$forceUpdate();
            }
        }
    };
</script>