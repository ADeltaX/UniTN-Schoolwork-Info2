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
                        <div class="img-container" :style='{ backgroundImage: "url(" + game.image_background + ")", }'></div>
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
    export default {
        computed: {
            // mappa `this.user` a `this.$store.getters.user`
            ...mapGetters({
                user: "user"
            })
        },
        data: function() {
            return {
                platforms: [],
                offset: 0,
                busy: false,
                page:0
            };
        },
        created: function() {
            this.loadMore();
            this.$forceUpdate();
        },

        //TODO: STOP LOADING IF NEXT PAGE IS NULL!!!!

        methods: {

            getGame(id,slug) {
                this.$router.push({ name: 'platform', params: { id ,slug} })
            },
            loadMore() {
                this.busy = true;
                this.page += 1;
                const axios = require("axios");
                let url="https://api.rawg.io/api/platforms?page=".concat(this.page);
                axios.get(url).then((response)=>{
                    this.platforms= this.platforms.concat(response.data.results);
                    this.busy = false;
                    //console.log(response)
                })
                .catch((error)=>{
                    this.busy = false;
                    console.log(error);
                });
                this.busy = false;
                this.$forceUpdate();


            }

        }

    };
</script>