<template>
    <div class="md-layout md-gutter">
        <div
                class="md-layout-item md-size-33 md-medium-size-50 md-xsmall-size-100"
                v-for="game in devs"
                :key="game.id"
                @click="getGame(game.id)">
            <md-card md-with-hover>
                <md-card-media-cover md-solid>
                    <md-card-media md-big>
                        <div class="container" :style='{ backgroundImage: "url(" + game.image_background + ")", }'></div>
                    </md-card-media>
                    <md-card-area>
                        <md-card-header>
                            <span class="md-title">{{game.name}}</span>
                        </md-card-header>
                        <md-card-actions></md-card-actions>
                    </md-card-area>
                </md-card-media-cover>
            </md-card>
        </div>
        <div id="load" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10"></div>
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
                loading: false,
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

            getGame(id) {
                this.$router.push({ name: 'dev', params: { id } })
            },
            loadMore() {
                this.loading = true;
                this.page += 1;
                const axios = require("axios");
                let url="https://api.rawg.io/api/developers?page=".concat(this.page);
                axios.get(url).then((response)=>{
                    this.devs = this.devs.concat(response.data.results);
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