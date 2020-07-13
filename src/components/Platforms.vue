<template>
    <div>
        <div>
            <h1 class="md-headline">Piattaforme</h1>
        </div>
        <div class="flex-container">
            <md-card md-with-hover v-for="game in platforms"
                :key="game.id">
                <router-link :to="`/platform/${game.id}/`">
                    <md-card-media-cover md-solid @click.native="getGame(game.id, game.slug)">
                        <md-card-media md-big>
                            <div class="img-container" :style='{ backgroundImage: "url(" + getResizedImage(game.image_background) + ")", }'></div>
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
    export default {
        computed: {
            // mappa `this.user` a `this.$store.getters.user`
            ...mapGetters({
                user: "user"
            })
        },
        data() {
            return {
                platforms: [],
                offset: 0,
                page: 0,
                canLoadMore: true
            };
        },
        created() {
            console.clear();
        },

        methods: {
            getResizedImage(url, size = 640){
                //Ci serve per forza altrimenti siamo costretti a caricare nel DOM immagini a 1920x1080 per un lag garantito
                if (url == null) //Capita che il server risponda con null
                    return null;

                return url.replace("https://media.rawg.io/media/", "https://media.rawg.io/media/resize/" + size + "/-/");
            },

            loadMore() {
                if (!this.canLoadMore)
                    return;

                this.page++;
                this.$g.pageLoading = true;
                const axios = require("axios");
                let url="https://api.rawg.io/api/platforms?&page_size=20&page=".concat(this.page);
                axios.get(url).then((response) => {
                    this.platforms= this.platforms.concat(response.data.results);
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