<template>
    <div style="position: relative; height: 100%">
        <md-card>
            <md-card-header>Utente con mail {{user.data.email}} </md-card-header>
            <md-card-content>
                <form>
                    <md-field>
                        <label>Username:  {{user.data.displayName}}</label>
                        <md-input v-model="user.data.displayName" md-counter="30"></md-input>
                        <span class="md-helper-text">Change username</span>
                    </md-field>
                </form>
            </md-card-content>
            <md-card-actions>
                <md-button>
                    <md-button class="md-raised" @click="nuclearOption(user.data.email)">Elimina account</md-button>
                </md-button>
                <md-button>
                    <md-button class="md-raised" @click="update(user.data.email,user.data.displayName )">UPDATE</md-button>
                </md-button>
            </md-card-actions>
        </md-card>
        <md-snackbar md-position="left" :md-active.sync="showSnackbar">
            <span>{{error}}</span>
        </md-snackbar>
        <md-snackbar md-position="left" :md-active.sync="updated">
            <span>User successfully updated!</span>
        </md-snackbar>
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
                error: null,
                showSnackbar:false,
                updated:false
            };
        },

        created() {
            console.clear();
            if (!this.user.loggedIn)
                this.$router.replace("/");
        },

        methods: {
            update(mail,name) {
                let db = firebase.firestore();
                let user = db.collection("users").doc(mail);
                let self=this;

                if(name==="")
                {
                    console.error("Error updating document: il nome è vuoto ");
                    self.error = "Il nome non dev'essere vuoto! ";
                    self.showSnackbar=true;
                    return;
                }

                return user.update({
                    username: name
                })
                    .then(function() {
                        console.log("User successfully updated!");
                        self.updated=true;
                    })
                    .catch(function(error) {
                        // The document probably doesn't exist.
                        console.error("Error updating document: ", error);
                        self.error = "errore durante l'aggiornamento";
                        self.showSnackbar=true;
                    });
            },
            nuclearOption(mail) {
                if(confirm("Vuoi veramente cancellare l'account? Verranno cancellate anche le review ed i preferiti!")){
                    let db = firebase.firestore();
                    let self=this;

                    console.log("Inizio eliminazione user dalla collection");

                    db.collection("users").doc(mail).delete().then(function() {
                        console.log("Eliminato user dalla collection");
                    }).catch(function(error) {
                        console.error("Error removing user document: ", error);
                        self.error = "errore durante la cancellazione";
                        self.showSnackbar=true;
                    });

                    console.log("Inizio eliminazione reviews dalla collection");

                    let fav_query = db.collection('reviews').where('user-id','==',mail);
                    fav_query.get().then(function(querySnapshot) {
                        querySnapshot.forEach(function(doc) {
                            doc.ref.delete();
                        });
                        console.log("reviews eliminate con successo")
                    });

                    console.log("Inizio eliminazione preferiti dalla collection");

                    let revs_query = db.collection('favourites').where('user-id','==',mail);
                    revs_query.get().then(function(querySnapshot) {
                        querySnapshot.forEach(function(doc) {
                            doc.ref.delete();
                        });
                        console.log("preferiti eliminati con successo")
                    });

                    if(self.error!= null)
                    {
                        console.log(self.error)
                        return
                    }

                    console.log("inizio eliminazione");

                    let user = firebase.auth().currentUser;
                    user.delete().then(function() {
                        console.log("Eliminazione dell'utente eseguita con successo");
                        self.$router.replace({
                            path: "/"
                        })
                    }).catch(function(error) {
                        console.error("Error deleting user: ", error);
                        self.error = "errore durante la cancellazione";
                        self.showSnackbar=true;
                    });



                }

            }
        }
    };
</script>

<style lang="scss" scoped>
    .md-app {
        max-height: 250px;
        border: 1px solid rgba(#000, .12);
    }

    .container {
        width: 450px;
        height: 300px;
        background-size: cover;
        background-repeat: no-repeat;
        background-position: 50% 50%;
        border-radius: 8px;
    }
</style>

