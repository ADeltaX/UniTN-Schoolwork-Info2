export default {
    goTo(router, x) {
        router.push({
            name: x
        });
    },

    goSpecific(router, x) {
        router.push(x);
    },

    goBack(router) {
        router.back();
    },

    getResizedImage(url, size = 640) {
        //Ci serve per forza altrimenti siamo costretti a caricare nel DOM immagini a 1920x1080/3840x2160 per un lag garantito (ovvero CPU e RAM alle stelle)
        if (url === null || url === undefined) //Capita che il server risponda con null
            return "/img/NoImage.png";

        return url.replace("https://media.rawg.io/media/", "https://media.rawg.io/media/resize/" + size + "/-/");
    },
    
    getTitleName: async function (urlBase, id) {
        let url = urlBase.concat(id);

        try {
            const axios = require("axios");
            let response = await axios.get(url);
            let name = response.data.name;
            document.title = name + " - GameReview"; //Alternativamente possiamo metterlo in ogni "created"
            return name;
        } catch {
            //Non è presente (404) o c'è stato un errore (40x, 50x) o manca connettività. Ambo i casi ritorniamo null.
            //Un case adeguato sarebbe quello di gestire i vari status code e differenziarli da un problema "not found" da quello "internal error"
            return null;
        }
    },
}
