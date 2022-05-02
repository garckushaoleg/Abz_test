<template>
    <section class="banner">
        <div class="banner__image">
            <h1>Test assignment for front-end developer</h1>
            <p>
                What defines a good front-end developer is one that has skilled knowledge of HTML, CSS, JS 
                with a vast understanding of User design thinking as they'll be building web interfaces with 
                accessibility in mind. They should also be excited to learn, as the world of Front-End Development 
                keeps evolving.
            </p>
            <span>Sign up</span>
        </div>
    </section>
</template>

<style lang="scss">
.banner {
    height: 650px;
    display: flex;
    justify-content: center;
    @include init-state;
    margin-bottom: 140px;
}

.banner__image {
    width: 100%;
    max-width: 1170px;
    height: 650px;
    background-image: url(@/static/images/banner.avif);
    background-position: center center;
    background-repeat: no-repeat;
    background-size: cover;
    @include flex-center-column;
    padding: 0 16px;

    h1 {
        font-family: $font-nunito;
        font-style: normal;
        font-weight: 400;
        font-size: 40px;
        line-height: 40px;
        text-align: center;
        color: #FFFFFF;
        width: 380px;
        max-width: 100%;
        margin-bottom: 21px;
    }

    p {
        width: 380px;
        max-width: 100%;
        font-family: $font-nunito;
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 26px;
        text-align: center;
        color: #FFFFFF;
        margin-bottom: 32px;
    }

    span {
        @include regular-button;
        padding: 4px 22px 4px 23px;

        &:hover {
            @include hover-button;
        }
    }
}

@media (max-width: 768px) {
    .banner {
        margin-bottom: -10px;
    }

    .banner__image {
        height: 500px;
    }
}

@media (max-width: 360px) {
    .banner__image {
        h1 {
            margin-top: -30px
        }
    }
}
</style>

<script>
export default {
    name: 'Banner',
}
</script>