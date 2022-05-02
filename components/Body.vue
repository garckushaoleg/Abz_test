<template>
    <section class="body">
        <div class="body_container">
            <h2>Working with GET request</h2>
            <ul class="users">
                <li v-for="(user, index) in users" :key="index" class="user">
                    <img :src="getImage(user.photo)" :alt="`${user.name} / ${user.position}`">
                    <h3 
                        class="user__info" 
                        @mousemove="onMouseMoveOnTooltip($event, 'name', index)"
                    >
                        {{ user.name }}
                    </h3>
                    <span class="tooltip" :id="`tooltip-name${index}`">{{ user.name }}</span>
                    <ul>
                        <li>
                            <span 
                                class="user__info" 
                                @mousemove="onMouseMoveOnTooltip($event, 'position', index)"
                            >
                                {{ user.position }}
                            </span>
                            <span class="tooltip" :id="`tooltip-position${index}`">{{ user.position }}</span>
                        </li>
                        <li>
                            <span 
                                class="user__info" 
                                @mousemove="onMouseMoveOnTooltip($event, 'email', index)"
                            >
                                {{ user.email }}
                            </span>
                            <span class="tooltip" :id="`tooltip-email${index}`">{{ user.email }}</span>
                        </li>
                        <li>
                            <span 
                                class="user__info" 
                                @mousemove="onMouseMoveOnTooltip($event, 'phone', index)"
                            >
                                {{ user.phone }}
                            </span>
                            <span class="tooltip" :id="`tooltip-phone${index}`">{{ user.phone }}</span>
                        </li>
                    </ul>
                </li>                     
            </ul>
            <div v-if="isPreloaderShowed">
                <Preloader />
            </div>
            <span class="button button_regular" @click="onClickOnShowMore" v-if="isActive">Show more</span>
            <span class="button button_disabled" disabled v-else>Show more</span>
        </div>
    </section>
</template>

<script>
import Preloader from '@/components/Preloader.vue';

export default {
    name: 'Body',
    components: {
        Preloader,
    },
    props: {
        isSuccessfulRegistration: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            params: {
                offset: 0,
                count: 0,
                page: 0,
            },
            users: [],
            isActive: true,
            totalUsers: 0,
            accumulatedUsers: [],
            gap: 0,
            isPreloaderShowed: true,
        }
    },
    watch: {
        isSuccessfulRegistration: {
            async handler() {
                if (this.isSuccessfulRegistration) {
                    this.init();
                }
            }
        }
    },
    methods: {
        async getResponse() {
            return await this.$axios.$get(this.getEndpoint());
        },

        onClickOnShowMore() {
            this.isPreloaderShowed = true;
            this.setCountOfUsersForRequest();

            this.getResponse()
            .then(response => this.onResponse(response))
            .catch(({ message }) => {
                this.isActive = false;
                this.isPreloaderShowed = false;
                alert(message);
            });
        },

        async onResponse(response) {
            this.setUsersForRendering(response);

            if (this.params.count !== this.totalUsers) return;

            const links = await response.links;
            if (!links.next_url) {
                this.isActive = false;
                return;
            }

            this.setValuesBeforeRequestToNextPage();

            this.checkNeedingOfRepeatedRequest();
        },

        checkNeedingOfRepeatedRequest() {
            if (this.gap) {
                this.params.count = this.gap - this.params.offset;
                this.gap = 0;
                this.onClickOnShowMore();
            }
        },

        async setUsersForRendering(response) {
            this.users = await response.users;
            this.users = [ ...this.accumulatedUsers, ...this.users ];
            this.sortUsersByDateRegistration();
            this.isPreloaderShowed = false;
        },

        sortUsersByDateRegistration() {
            this.users.sort((a, b) => b.registration_timestamp - a.registration_timestamp);
        },

        setCountOfUsersForRequest() {
            this.params.count += this.params.offset;
            
            if (this.params.count > this.totalUsers) {
                this.gap = this.params.count - this.totalUsers;
                this.params.count = this.totalUsers;
            }
        },

        setValuesBeforeRequestToNextPage() {
            this.params.page++;
            this.params.count = 0;
            this.accumulatedUsers = [ ...this.users ];
        },

        getEndpoint() {
            return `https://frontend-test-assignment-api.abz.agency/api/v1/users?page=${this.params.page}&count=${this.params.count}`;
        },
        
        getImage(path) {
            return path.includes('placeholders') ? require('@/static/svg/icon.svg') : path;
        },

        onMouseMoveOnTooltip({ clientX, clientY }, type, index) {
            const id = `tooltip-${type}${index}`;
            document.getElementById(id).style.left = `${clientX - 16}px`;
            document.getElementById(id).style.top = `${clientY + 25}px`;
        },

        async init() {
            this.createInitialParams();
            const response = await this.getResponse();
            this.users = await response.users;
            this.totalUsers = await response.total_users;

            this.sortUsersByDateRegistration();
            this.isPreloaderShowed = false;
        },

        createInitialParams() {
            this.params = {
                page: 1,
                count: 6,
                offset: 6
            }
        }
    },
    async created() {
        this.init();
    }
}
</script>

<style lang="scss">
li {
    list-style-type: none;
}

.user__info {
    cursor: pointer;

    &:hover + .tooltip {
        display: inline-block;
    }
}

.tooltip {
    display: none;
    background-color: black;
    color: #fff;
    border-radius: 4px;
    padding: 3px 16px;
    position: fixed;
    z-index: 99999;
    @include regular-font-styles;
}

.body {
    width: 100%;
    @include init-state;
    @include flex-center-row;
    padding-bottom: 140px;
}

.body_container {
    width: 100%;
    max-width: 1290px;
    @include flex-center-column;

    h2 {
        font-family: $font-nunito;
        font-style: normal;
        font-weight: 400;
        font-size: 40px;
        line-height: 40px;
        margin-bottom: 50px;
        text-align: center;
        padding: 0 20px;
    }
}

.users {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    padding: 0 60px;
}

.user {
    width: 100%;
    min-width: 282px;
    background-color: white;
    border-radius: 10px;
    @include flex-center-column;
    text-align: center;
    padding: 20px;
    margin: 0 29px 29px 0px;
    flex: 1;

    &:nth-child(3n) {
        margin-right: 0px;
    }

    img {
        border-radius: 50%;
        margin-bottom: 20px;
        width: 70px;
    }

    h3 {
        margin-bottom: 20px;
        @include regular-font-styles;
        max-width: 330px;
        width: 100%;
        @include preventing-overflow-text;
        padding: 0 10px;
    }

    ul {
        max-width: 330px;
        width: 100%;

        li {
            @include regular-font-styles;
            @include preventing-overflow-text;
        }
    }
}

.button {
    margin-top: 21px;
    padding: 4px 18px 4px 19px;
}

.button_regular {
    @include regular-button;

    &:hover {
        @include hover-button;
    }
}

.button_disabled {
    @include disabled-button;
}

@media (max-width: 1024px) {
    .users {
        padding: 0 60px;
    }

    .user {
        min-width: 281px;

        &:nth-child(2n) {
            margin-right: 29px;
        }

        &:nth-child(3n) {
            margin-right: 0;
        }
    }
}

@media (max-width: 1020px) {
    .users {
        padding: 0 32px;
    }

    .user {
        max-width: 344px;
        margin: 0 16px 16px 0;

        &:nth-child(2n) {
            margin-right: 16px;
        }

        &:nth-child(3n) {
            margin-right: 0;
        }
    }
}

@media (max-width: 941px) {
    .user {
        margin: 0 16px 16px 0;
        min-width: 280px;
    }
}

@media (max-width: 938px) {
    .users {
        justify-content: center;
    }

    .user {
        margin: 0 16px 16px 0;
        min-width: 282px;

        &:nth-child(3n) {
            margin-right: 16px;
        }

        &:nth-child(2n) {
            margin-right: 0;
        }
    }
}

@media (max-width: 768px) {
    .button {
        margin-top: 35px;
    }
}

@media (max-width: 644px) { 
    .user {
         min-width: 279px;
    }
}


@media (max-width: 638px) {

    .users {
        padding: 0 40px;
    }

    .user {
        margin: 0 0 16px 0;

        &:nth-child(3n) {
            margin-right: 0;
        }

        &:nth-child(2n) {
            margin-right: 0;
        }
    }
}

@media (max-width: 550px) {

    .users {
        padding: 0 16px;
    }

    .user {
        margin: 0 0 20px 0;

        &:nth-child(3n) {
            margin-right: 0;
        }

        &:nth-child(2n) {
            margin-right: 0;
        }
    }

    .button {
        margin-top: 30px;
    }
}
</style>