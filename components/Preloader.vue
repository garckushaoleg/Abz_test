<template>
    <img src="@/static/svg/preloader.svg" alt="Preloader" class="preloader">
</template>

<style scoped>
.preloader {
    animation: spin 1.5s linear infinite;
}

@keyframes spin {
    0%   {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
</style>