<template>
    <div class="centered-container">
        <md-content class="md-elevation-4">
            <div class="title">
                <img alt="logo" src="../assets/GR_Logo_256.png">
                <div class="md-title">GameReview</div>
                <div class="md-body-1">Registrati per salvare i tuoi preferiti e per recensire giochi!</div>
            </div>
            <div class="form">
                <md-field>
                    <label>Nome utente</label>
                    <md-input v-model="form.name" autofocus></md-input>
                </md-field>
                <md-field>
                    <label>E-mail</label>
                    <md-input v-model="form.email" autofocus></md-input>
                </md-field>
                <md-field md-has-password>
                    <label>Password</label>
                    <md-input v-model="form.password" type="password"></md-input>
                </md-field>
            </div>
            <div class="actions md-layout md-alignment-center-space-between">
                <md-button class="md-raised md-primary" @click="submit">Register</md-button>
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
    import {mapGetters} from "vuex";
    import "@firebase/app";
    import firebase from "@firebase/app";
    import "@firebase/firestore";

    export default {
        data() {
            return {
                loading: false,
                showSnackbar: false,
                form: {
                    name: "",
                    email: "",
                    password: ""
                },
                error: null
            };
        },

        computed: {
            // mappa `this.user` a `this.$store.getters.user`
            ...mapGetters({
                user: "user"
            })
        },

        created() {
            document.title = "Registrati - GameReview";

            if (this.user.loggedIn)
                this.$router.replace("/");
        },

        methods: {
            submit() {
                this.loading = true;
                this.showSnackbar = false;
                let router = this.$router;
                let db = firebase.firestore();
                let self = this;

                firebase.auth()
                    .createUserWithEmailAndPassword(this.form.email, this.form.password)
                    .then(data => {
                        data.user.updateProfile({
                            displayName: self.form.name,
                            email: self.form.email
                        })
                            .then(() => {
                                //TODO: password hashato

                                //FIX for login issue.
                                self.user.data.displayName = self.form.name;

                                db.collection("users").doc(self.form.email.toLowerCase()).set({
                                    username: self.form.name,
                                    password: self.form.password,
                                })
                                    .then(function () {
                                        console.log("Utente aggiunto con successo");
                                    })
                                    .catch(function (error) {
                                        console.error("Error writing document: ", error);
                                    });

                                router.replace("/");
                            });
                    })
                    .catch(err => {
                        this.error = err.message;
                        this.showSnackbar = true;
                        this.loading = false;
                    });

                //Lo aggiungiamo alla collection utenti, così da poter salvare lo username
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