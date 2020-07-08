
    import firebase from 'firebase';
    import store from "@/store";
    const configOptions = {
        apiKey: "AIzaSyA86bFqzVk8ukOzjf3E61J9YEBzolj2Wb0",
        authDomain: "gamereview-bb9af.firebaseapp.com",
        databaseURL: "https://gamereview-bb9af.firebaseio.com",
        projectId: "gamereview-bb9af",
        storageBucket: "",
        messagingSenderId: "",
        appId: ""
    };

    !firebase.apps.length ? firebase.initializeApp(configOptions).firestore() : firebase.app().firestore();

    let db = firebase.firestore();

    firebase.auth().onAuthStateChanged(user => {
        store.dispatch("fetchUser", user);
    });
    export default {


        //TODO;Questa ritorna undefined
        checkFavs(gameId, userId) {
            let id = "".concat(userId).concat('-').concat(gameId);

            //controlliamo se è già inserito
            db.collection("favourites").doc(id)
                .get().then(function (ris) {
                    return ris.exists;
              /*- if (ris.exists) {
                      console.log("I'm true");
                    return 0;
                }
                else {
                      console.log(ris);
                     console.log("I'm false");
                    return 1;
                }-*/
            }).catch(function (error) {
                console.error("Error reading document: ", error);
            });
        },
        //questa va (li aggiunge, non fa il check)
        addFavs(gameId, userId) {
                let id = "".concat(userId).concat("-").concat(gameId);

                let  ris = this.checkFavs(gameId, userId);

                        console.log("ris:"+ris);

                        if (ris) {
                            //se lo è lo togliamo
                            db.collection("favourites").doc(id).delete().then(function () {
                                console.log("Document successfully deleted!");
                            }).catch(function (error) {
                                console.error("Error removing document: ", error);
                            });
                        } else {
                            //altrimenti lo aggiungiamo
                            db.collection("favourites").doc(id).set({
                                "user-id": userId,
                                "game-id": gameId
                            }).then(function () {
                                console.log("Document successfully added!");
                            }).catch(function (error) {
                                console.error("Error adding document: ", error);
                            });

                        }

            }



        }




