<template>
    <div class="md-layout md-gutter">
        <div
                class="md-layout-item md-size-33 md-medium-size-50 md-xsmall-size-100"
                v-for="game in pubs"
                :key="game.id"
                @click="getGame(game.id,game.slug)">
            <md-card md-with-hover>
                <md-card-media-cover md-solid>
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
                pubs: [],
                offset: 0,
                loading: false,
                page:1
            };
        },
        created: function() {
            this.loadMore();
            this.$forceUpdate();
        },
        methods: {

            getGame(id,slug) {
                this.$router.push({ name: 'pub', params: { id,slug } })
            },
            loadMore() {
                this.loading = true;
                this.page += 1;
                const axios = require("axios");
                let url="https://api.rawg.io/api/publishers?page=".concat(this.page);
                axios.get(url).then((response)=>{
                    this.pubs = this.pubs.concat(response.data.results);
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