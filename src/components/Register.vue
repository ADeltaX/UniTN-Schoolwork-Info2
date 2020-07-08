<template>
    <div class="centered-container">
        <md-content class="md-elevation-3">

            <div class="title">
                <!--img src="https://vuematerial.io/assets/logo-color.png"-->
                <div class="md-title">Register</div>
                <div class="md-body-1"></div>
            </div>

            <div class="form">

                <md-field>
                    <label>Name</label>
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
                <md-progress-spinner md-mode="indeterminate" :md-stroke="2"></md-progress-spinner>
            </div>

        </md-content>
        <div class="background" />
    </div>
</template>



<script>
    import firebase from "firebase";

    export default {
        data() {
            return {
                loading:false,
                form: {
                    name: "",
                    email: "",
                    password: ""
                },
                error: null
            };
        },

        //TODO;controllare perché non va più pd2
        methods: {
            submit() {
                let router = this.$router;
                let db = firebase.firestore();
                firebase
                    .auth()
                    .createUserWithEmailAndPassword(this.form.email, this.form.password)
                    .then(data => {
                        data.user
                            .updateProfile({
                                displayName: this.form.name,
                                email: this.form.email
                            })
                            .then(() => {router.replace("/");});
                    })
                    .catch(err => {
                        this.error = err.message;
                    });
                // lo aggiungiamo alla collection utenti, così da poter salvare lo username

                //TODO;password in chiaro?
                db.collection("users").doc(this.form.email).set({
                    username: this.form.name,
                    password: this.form.password,
                })
                    .then(function() {
                        console.log("Utente aggiunto con successo");
                    })
                    .catch(function(error) {
                        console.error("Error writing document: ", error);
                    });

            }
        }
    };
</script>

<style lang="scss">
    .centered-container {
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        height: 100vh;
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
        .form {
            margin-bottom: 60px;
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