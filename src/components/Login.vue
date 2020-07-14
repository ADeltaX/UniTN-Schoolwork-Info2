<template>
    <div class="centered-container">
        <md-content class="md-elevation-4">
            <div class="title">
                <img alt="logo" src="../assets/GR_Logo_256.png">
                <div class="md-title">Game Review</div>
                <div class="md-body-1">Accedi per salvare i tuoi preferiti e per recensire giochi!</div>
            </div>
            <div class="form">
                <md-field>
                    <label>E-mail</label>
                    <md-input v-model="form.email" autofocus></md-input>
                </md-field>
                <md-field md-has-password>
                    <label>Password</label>
                    <md-input v-model="form.password" type="password"></md-input>
                </md-field>
                <div class="actions md-layout md-alignment-right">
                    <md-button class="md-raised md-primary" @click="submit">Accedi</md-button>
                </div>
            </div>
            <div class="loading-overlay" v-if="loading">
                <md-progress-spinner md-mode="indeterminate"></md-progress-spinner>
            </div>
            <md-snackbar md-position="left" :md-active.sync="showSnackbar">
                <span>{{error}}</span>
            </md-snackbar>
        </md-content>
    </div>
</template>

<script>
    import { mapGetters } from "vuex";
    import "@firebase/app";
    import firebase from "@firebase/app";
    import "@firebase/firestore";

    export default {
        computed: {
            // mappa `this.user` a `this.$store.getters.user`
            ...mapGetters({
                user: "user"
            })
        },

        data() {
            return {
                loading: false,
                showSnackbar: false,
                form: {
                    email: "",
                    password: ""
                },
                error: null
            };
        },

        created() {
            document.title = "Accedi - Game Review";

            if (this.user.loggedIn)
                this.$router.replace("/");
        },

        methods: {
            submit() {
                this.loading = true;
                let router = this.$router;

                firebase.auth()
                .signInWithEmailAndPassword(this.form.email, this.form.password)
                .then(function() {
                    router.replace("/");
                    this.loading = false;
                })
                .catch(err => {
                    this.error = err.message;
                    this.showSnackbar = true;
                    this.loading = false;
                });
            }
        }
    };
</script>

<style lang="scss" scoped>
    .centered-container {
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        height: 100%;

        .title {
            text-align: center;
            margin-bottom: 30px;
            img {
                margin-bottom: 16px;
                max-width: 80px;
            }
        }

        .actions {
            .md-button {
                margin: 0;
            }
        }

        .md-content {
            z-index: 1;
            padding: 40px;
            width: 100%;
            max-width: 400px;
            position: relative;
        }

        .loading-overlay {
            z-index: 10;
            top: 0;
            left: 0;
            right: 0;
            position: absolute;
            width: 100%;
            height: 100%;
            background: rgba(255, 255, 255, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }
</style>