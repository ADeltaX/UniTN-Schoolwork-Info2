<template>
    <div class="md-layout" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
        <md-card class="md-layout-item" >
            <md-card-header>
                <md-card-header-text>
          <span class="md-title">
            {{game.name}}
          </span>
                </md-card-header-text>

            </md-card-header>
            <md-card-content>
                <md-table>
                    <md-table-row>
                        <md-table-cell>
                            <b>Description</b>
                        </md-table-cell>
                        <md-table-cell><span v-html="game.description"></span></md-table-cell>
                    </md-table-row>
                    <md-table-row>
                        <md-table-cell>
                            <b>Developers</b>
                        </md-table-cell>
                        <md-table-cell>
                            <ul>
                                <li
                                        v-for="devs in game.developers"
                                        :key="devs.id"
                                >{{devs.name}}</li>
                            </ul>
                        </md-table-cell>
                    </md-table-row>
                    <md-table-row>
                        <md-table-cell>
                            <b>Genres</b>
                        </md-table-cell>
                        <md-table-cell>
                            <ul>
                                <li
                                        v-for="gen in game.genres"
                                        :key="gen.id"
                                >{{gen.name}}</li>
                            </ul>
                        </md-table-cell>
                    </md-table-row>
                    <md-table-row>
                        <md-table-cell>
                            <b>Platforms</b>
                        </md-table-cell>
                        <md-table-cell>
                            <ul>
                                <li
                                        v-for="plat in game.platforms"
                                        :key="plat.id"
                                >{{plat.platform.name}}<pre></pre><strong>Release date</strong>: {{plat.released_at}}

                                </li>
                            </ul>
                        </md-table-cell>
                    </md-table-row>

                    <md-table-row>
                        <md-table-cell>
                            <md-card-media md-big>
                                <video width="1920" height="1080" autoplay>
                                    <source :src="game.clip.clip" type="video/mp4">
                                    Your browser does not support the video tag.
                                </video>
                                <!--TODO;controllare se il video è null -->

                            </md-card-media>
                        </md-table-cell>
                        <md-table-cell>
                            <a>{{game.website}}</a>
                            <ul>
                                <li
                                        v-for="st in game.stores"
                                        :key="st.id"
                                >{{st.store.name}}:{{st.url}}</li>
                            </ul>

                        </md-table-cell>
                    </md-table-row>
                </md-table>
                <br>

            </md-card-content>
            <md-button class="md-icon-button" @click="goBack()">
                <md-icon>fast_rewind</md-icon>
            </md-button>
        </md-card>

    </div>
</template>

<script>

    import {mapGetters} from "vuex";

    export default {
        data: function() {
            return {
                game: null,
                showSnackbar: false,
                showSnackbarTrue: false,
                showSnackbarFalse: false,

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
            let url = "https://api.rawg.io/api/games/".concat(this.$route.params.id);
            axios.get(url).then((response)=>{
                this.game = response.data;
                console.log(response);

            })
                .catch((error)=>{
                    console.log(error)
                })
        },
        methods: {

            goBack: function() {
                this.$router.back();
            }
        }
    };
</script>
