<template>
    <div>
        <div v-if="busy" style="position: absolute; width: 100%; z-index: 100;">
            <md-progress-bar class="md-accent" md-mode="indeterminate"></md-progress-bar>
        </div>
        <div class="flex-container" style="margin-bottom: 24px">
            <md-card md-with-hover v-for="game in platforms"
                :key="game.id">
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
            </md-card>
            <div id="load" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="400" >
            </div>
        </div>
    </div>
</template>
<script>
    import { mapGetters } from "vuex";
    import ls from "local-storage"
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
                busy: false,
                page: 0,
                canLoadMore: true
            };
        },
        created() {
            console.clear();
            this.loadMore();
            this.$forceUpdate();
        },

        methods: {
            getResizedImage(url, size = 640){
                //Ci serve per forza altrimenti siamo costretti a caricare nel DOM immagini a 1920x1080 per un lag garantito
                if (url == null) //Capita che il server risponda con null
                    return null;

                return url.replace("https://media.rawg.io/media/", "https://media.rawg.io/media/resize/" + size + "/-/");
            },

            getGame(id,slug) {
               // let store= require("local-storage")
                ls('platformSlug', slug);
                ls('platformId', id);
                this.$router.push({ name: 'platform', params: { id ,slug} })
            },

            loadMore() {
                if (!this.canLoadMore)
                    return;

                this.page++;
                this.busy = true;
                const axios = require("axios");
                let url="https://api.rawg.io/api/platforms?&page_size=20&page=".concat(this.page);
                axios.get(url).then((response) => {
                    this.platforms= this.platforms.concat(response.data.results);
                    this.busy = false;

                    if (response.data.next == null)
                        this.canLoadMore = false;
                })
                .catch((error) => {
                    this.page--;
                    this.busy = false;
                    console.log(error);
                });
                this.$forceUpdate();
            }
        }
    };
</script>