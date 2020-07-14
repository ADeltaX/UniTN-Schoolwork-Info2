<template>
    <div class="centered-container" style="position: relative; height: 100%">
        <md-empty-state
            md-icon="cancel"
            md-label="404!"
            md-description="La pagina che stai cercando non esiste.">
            <md-button class="md-primary md-raised" @click="foes.goTo($router,'home')">Home</md-button>
        </md-empty-state>
    </div>
</template>

<script>
    import foes from "../foes"
    export default {
        data(){
            return{
                foes
            }
        },
        created() {
            document.title = "Non trovato - Game Review";
        }
    }
</script>