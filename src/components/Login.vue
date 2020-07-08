<template>
    <div class="centered-container">

        <md-content class="md-elevation-3">

            <div class="title">
                <!--img src="https://vuematerial.io/assets/logo-color.png"-->
                <div class="md-title">Login</div>
                <div class="md-body-1"></div>
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
                <div class="actions md-layout md-alignment-center-space-between">
                    <!--<a href="/resetpassword">Reset password</a>-->
                    <md-button class="md-raised md-primary" @click="submit">Log in</md-button>
                </div>

            </div>
            <div class="loading-overlay" v-if="loading">
                <md-progress-spinner md-mode="indeterminate" :md-stroke="2"></md-progress-spinner>
            </div>





        </md-content>
        <div class="background" />
    </div>
</template>


<style lang="scss" scoped>
    .md-progress-bar {
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
    }
</style>

<script>
    import firebase from "firebase";

    export default {
        data() {
            return {
                loading:false,
                form: {
                    email: "",
                    password: ""
                },
                error: null
            };
        },

        //TODO;controllare perché non va più, pd
        methods: {
            submit() {
                firebase
                    .auth()
                    .signInWithEmailAndPassword(this.form.email, this.form.password)
                    .then(data)
                    .catch(err => {
                        this.error = err.message;
                    });

                function data() {
                    this.$router.push({name: "home"});
                }
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