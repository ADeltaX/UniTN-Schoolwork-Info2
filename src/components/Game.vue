<template>
    <div class="md-layout">
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
                                <li v-for="devs in game.developers"
                                    :key="devs.id">
                                    {{devs.name}}
                                </li>
                            </ul>
                        </md-table-cell>
                    </md-table-row>
                    <md-table-row>
                        <md-table-cell>
                            <b>Genres</b>
                        </md-table-cell>
                        <md-table-cell>
                            <ul>
                                <li v-for="gen in game.genres"
                                    :key="gen.id">
                                    {{gen.name}}
                                </li>
                            </ul>
                        </md-table-cell>
                    </md-table-row>
                    <md-table-row>
                        <md-table-cell>
                            <b>Platforms</b>
                        </md-table-cell>
                        <md-table-cell>
                            <ul>
                                <li v-for="plat in game.platforms"
                                    :key="plat.id">
                                    {{plat.platform.name}}
                                    <pre></pre>
                                    <strong>Release date</strong>:
                                    {{plat.released_at}}
                                </li>
                            </ul>
                        </md-table-cell>
                    </md-table-row>
                    <md-table-row>
                        <md-table-cell>
                            <md-card-media md-big >
                                <video width="1920" height="1080" autoplay v-if="game.clip != null">
                                    <source :src="game.clip.clip" type="video/mp4">
                                    Your browser does not support the video tag.
                                </video>
                                <img v-else :src="game.background_image" >
                            </md-card-media>
                        </md-table-cell>
                        <md-table-cell>
                            <a>{{game.website}}</a>
                            <ul>
                                <li v-for="st in game.stores"
                                    :key="st.id">
                                    {{st.store.name}}:{{st.url}}
                                </li>
                            </ul>

                        </md-table-cell>
                    </md-table-row>
                </md-table>
                <br>

            </md-card-content>
            <!-- TODO;fixare il goBack -->
            <md-button class="md-icon-button" @click="goBack()">
                <md-icon>fast_rewind</md-icon>
            </md-button>
        </md-card>
        <md-card class="md-layout-item">
            <md-card-header>
                <span class="md-title">
                        Scrivi una recensione
                    </span>
            </md-card-header>
            <md-card-content>
                <template>
                    <form>
                        <md-field>
                            <label>Counter</label>
                            <md-input v-model="regular" md-counter="30"></md-input>
                        </md-field>

                        <md-field>
                            <label>Max Length</label>
                            <md-input v-model="maxLength" maxlength="30"></md-input>
                        </md-field>

                        <md-field :md-counter="false">
                            <label>Maxlength with disabled counter</label>
                            <md-input v-model="disabled" maxlength="10"></md-input>
                        </md-field>

                        <md-field>
                            <label>Autogrow</label>
                            <md-textarea v-model="autogrow" md-autogrow md-counter="200"></md-textarea>
                        </md-field>

                        <md-field>
                            <label>Textarea</label>
                            <md-textarea v-model="textarea" md-counter="80"></md-textarea>
                        </md-field>

                        <md-button class="md-raised" type="reset">RESET</md-button>
                    </form>
                </template>
            </md-card-content>

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

            let url = "https://api.rawg.io/api/games/".concat(this.$route.params.id);
            console.log(url);
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
