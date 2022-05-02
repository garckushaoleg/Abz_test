<template>
    <header class="header">
        <div class="header_container">
            <a href="/" class="logo_container">
                <img src="@/static/svg/logo.svg" alt="Cat">
            </a>
            <ul class="menu">
                <li>Users</li>
                <li>Sign up</li>
            </ul>
        </div>
    </header>
</template>

<script>
export default {
    name: 'Header'
}
</script>

<style lang="scss">

* {
    padding: 0;
    margin: 0;
    text-decoration: none;
}

.header {
    width: 100%;
    height: 60px;
    display: flex;
    justify-content: center;
    background-color: white;
}

.header_container {
    max-width: 1290px;
    height: 100%;
    width: 100%;
    @include flex-space-between-center;
    padding: 0 60px;
}

.logo_container {
    @include flex-space-between-center;
}

.menu {
    display: flex;
    list-style-type: none;

    li {
        @include regular-button;
        margin-left: 10px;

        &:hover {
            @include hover-button;
        }

        &:nth-child(1) {
            padding: 4px 29px;
            margin-left: 14px;
        }

        &:nth-child(2) {
            padding: 4px 22px 4px 23px;
        }
    }
}

@media (max-width: 768px) {
    .header_container {
        padding: 0 32px;
    }
}

@media (max-width: 400px) {
    .header_container {
        padding: 0 16px;
    }
}
</style>