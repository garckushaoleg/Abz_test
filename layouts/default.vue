<template>
    <div class="main">
        <Header />
        <Banner />
        <Body :isSuccessfulRegistration="isSuccessfulRegistration" />
        <Footer @onSuccessfulRegistration="onSuccessfulRegistration" />
    </div>
</template>

<script>
import Header from '@/components/Header';
import Banner from '@/components/Banner';
import Body from '@/components/Body';
import Footer from '@/components/Footer';

export default {
    components: {
        Header,
        Banner,
        Body,
        Footer
    },
    data() {
        return {
            isSuccessfulRegistration: false,
        }
    },
    methods: {
        onSuccessfulRegistration() {
            this.isSuccessfulRegistration = true;
        }
    }
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Nunito&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Asap&family=Nunito&display=swap');

.main {
    background-color: $background-color-body;
}
</style>