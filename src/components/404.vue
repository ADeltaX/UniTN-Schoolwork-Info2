<template>
    <div class="centered-container" style="position: relative; height: 100%">
        <md-empty-state
            md-icon="cancel"
            md-label="404!"
            md-description="The page you are searching for doesn't exist anymore or contains errors.">
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
        }
    }

</script>