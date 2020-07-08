<template>
    <div class="md-layout md-gutter">
        <div
                class="md-layout-item md-size-33 md-medium-size-50 md-xsmall-size-100"
                v-for="game in pubs"
                :key="game.id"
                @click="getGame(game.id)"
        >
            <md-card md-with-hover>
                <md-card-media-cover md-solid>
                    <md-card-media md-big>
                        <img :src="game.image_background">
                    </md-card-media>

                    <md-card-area>
                        <md-card-header>
                            <span class="md-title">{{game.name}}</span>
                        </md-card-header>

                        <md-card-actions>
                        </md-card-actions>
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
                this.$router.push({ name: 'pub', params: { id } })
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
        height: 250px;
        margin: 4px;
        display: inline-block;
        vertical-align: top;
    }
</style>