 export default {

     goTo(router,x) {
         router.push({
             name: x
         });
     },
     goBack(router)
     {
         router.back();
     },
     getResizedImage(url, size = 640){
         //Ci serve per forza altrimenti siamo costretti a caricare nel DOM immagini a 1920x1080 per un lag garantito
         if (url == null) //Capita che il server risponda con null
             return null;

         return url.replace("https://media.rawg.io/media/", "https://media.rawg.io/media/resize/" + size + "/-/");
     }
 }
