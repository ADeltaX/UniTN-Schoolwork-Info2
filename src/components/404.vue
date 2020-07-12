<template>
    <div class="centered-container" style="position: relative; height: 100%">
        <md-empty-state
            md-icon="cancel"
            md-label="404!"
            md-description="The page you are searching for doesn't exist anymore or contains errors.">
            <md-button class="md-primary md-raised" @click="goHome()">Home</md-button>
        </md-empty-state>
    </div>
</template>

<script>
    import { mapGetters } from "vuex";
    export default {
        computed: {
            ...mapGetters({
                user: "user"
            })
        },

        methods: {
            goHome() {
                this.$router.replace('/');
            }
        }
    };
</script>