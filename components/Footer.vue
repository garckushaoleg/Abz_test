<template>
    <v-app>
        <section class="footer" v-if="statusOfRegistration === 'no registered'">
            <v-form class="form" v-model="valid" ref="form" @submit.prevent="submit">
                <h1>Working with POST request</h1>
                <v-text-field 
                    label="Your name" 
                    class="input_user" 
                    v-model="user.name" 
                    outlined 
                    :rules="nameRules" 
                />
                <v-text-field 
                    label="Email" 
                    class="input_user" 
                    v-model="user.email" 
                    outlined 
                    :rules="emailRules"
                />
                <v-text-field 
                    label="Phone" 
                    persistent-hint 
                    hint="+38 (XXX) XXX - XX - XX" 
                    class="input_user" 
                    v-model="user.phone" 
                    outlined 
                    :rules="phoneRules" 
                />
                <div class="positions">
                    <p>Select your position</p>
                    <label v-for="position in positions" :key="position.id" class="position">
                        <input 
                            type="radio" 
                            name="position" 
                            :id="`radio-${position.id}`" 
                            @input="onChecked(position.id)"
                        />
                        <label :for="`radio-${position.id}`" />
                        <span>{{ position.name }}</span>
                    </label>
                </div>
                <div class="button_upload">
                    <input 
                        type="file" 
                        class="hidden" 
                        id="upload" 
                        @change="onChangeOnFileInput($event)" 
                        accept=".jpg, .jpeg"

                    />
                    <label for="upload">
                        <span>Upload</span>
                        <span>{{ uploadedFileName }}</span>
                    </label>
                    <p class="error-text">{{ error }}</p>
                </div>
                <button class="button_regular" v-if="isActive">Sign up</button>
                <button class="button_disabled" disabled v-else>Sign up</button>
            </v-form>
        </section>
        <section v-else-if="statusOfRegistration === 'processing'" class="preloader_container">
            <Preloader />
        </section>
        <section class="form_success" v-else>
            <h1>User successfully registered</h1>
            <img src="@/static/svg/success-image.svg" alt="Successful Registration">
        </section>
    </v-app>
</template>

<script>
import { Rules } from '@/shared/rules/rules.js';
import Preloader from '@/components/Preloader.vue';

export default {
    name: 'Footer',
    components: {
        Preloader,
    },
    data() {
        return {
            positions: [],
            position: 0,
            user: {
                name: '',
                email: '',
                phone: '',
                positionId: 0,
                photo: {}
                
            },
            emailRules: [],
			nameRules: [],
			phoneRules: [],
            valid: false,
            uploadedFileName: 'Upload your photo',
            error: '',
            isUploadedFileValid: false,
            statusOfRegistration: 'no registered'
        }
    },
    computed: {
        isActive() {
            return this.valid && !!this.user.positionId && this.isUploadedFileValid;
        }
    },
    methods: {
        async getPositions() {
            return await this.$axios.$get('https://frontend-test-assignment-api.abz.agency/api/v1/positions');
        },

        getRules() {
			this.emailRules = [
				(v) => Rules.isRequiredField(v, 'Field is required'),
				(v) => Rules.validEmail(v, 'Email must be valid'),
                (v) => Rules.maxNumberOfSymbols(v, 'Max 100 characters'),
				(v) => Rules.minNumberOfSymbols(v, 'Min 2 characters')
			];
			this.nameRules = [
				(v) => Rules.isRequiredField(v, 'Field is required'),
				(v) => Rules.maxNumberOfSymbols(v, 'Max 60 characters'),
				(v) => Rules.minNumberOfSymbols(v, 'Min 4 characters')
			];
			this.phoneRules = [
                (v) => Rules.isRequiredField(v, 'Field is required'),
                (v) => Rules.validPhone(v, 'Phone must be valid'),
            ];
		},

        async submit() {
            let response = await this.$axios.$get('https://frontend-test-assignment-api.abz.agency/api/v1/token');
            const config = {
                headers: { 'Token': await response.token }
            };
            const formData = this.getFormData();
            this.statusOfRegistration = 'processing';
            this.$axios.$post('https://frontend-test-assignment-api.abz.agency/api/v1/users', formData, config)
            .then(_ => {
                this.statusOfRegistration = 'success';
                this.$emit('onSuccessfulRegistration');
            })
            .catch(({ message }) => {
                alert(message);
                this.statusOfRegistration = 'no registered'
            });
        },

        getFormData() {
            const formData = new FormData();
            for (const key in this.user) {
                const keyOfFormData = this.isValidKeyForFormData(key) ? key : this.getFormDataKey(key);
                formData.append(keyOfFormData, this.user[key]);
            }

            return formData;
        },

        isValidKeyForFormData(key) {
            return key === key.toLowerCase();
        },

        getFormDataKey(key) {
            const letters = key.split('');
            const found = letters.findIndex(letter => letter !== letter.toLowerCase());
            letters[found] = letters[found].toLowerCase();
            letters.splice(found, 0, '_');
            return letters.join('');
        },

        onChangeOnFileInput($event) {
            this.isUploadedFileValid = true;
            this.error = '';
            const { size, name } = $event.target.files[0];
            this.uploadedFileName = name;
            if (size > 5000000) {
                this.error = 'File size exceeded';
                this.isUploadedFileValid = false;
                return;
            }

            let img = new Image();
            img.src = window.URL.createObjectURL($event.target.files[0]);
            img.onload = () => {
                if (img.height < 70 || img.width < 70) {
                    this.error = 'Minimum size of photo 70x70px';
                    this.isUploadedFileValid = false;
                } else {
                    this.user.photo = $event.target.files[0];
                }
            }
        },

        onChecked(id) {
            this.user.positionId = id
        }
    },
    async created() {
        const response = await this.getPositions();
        this.positions = await response.positions;
        this.getRules();
    }
}
</script>

<style lang="scss">

.form {
    @include flex-center-column;
    padding-bottom: 100px;

    div {
        @include input-width;
    }

    h1 {
        font-family: $font-nunito;
        font-style: normal;
        font-weight: 400;
        font-size: 40px;
        line-height: 40px;
        padding: 0 20px;
        text-align: center;
    }

    .input_user {
        margin-top: 50px;
        @include input-width;
        height: 54px;
        @include regular-font-styles;
        color: #7E7E7E;
    }

    p {
        @include regular-font-styles;
        margin-bottom: 11px;
    }

    button {
        margin-top: 50px;
        border: none;
        padding: 4px 22px 4px 23px;
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
}

.footer {
    @include init-state;
    padding: 0 16px;
}

.positions {
    margin-top: 43px;
}

.position {
    display: flex;
    align-items: center;
    margin-bottom: 7px;
    position: relative;

    span {
        margin-left: 32px;
        @include regular-font-styles;
        cursor: pointer;
    }

    input {
        position: absolute;
        opacity: 0;
    }

    label {
        position: absolute;
        top: 2px;
        left: 0;
        height: 22px;
        width: 22px;
        background-color: $background-color-body;
        border-radius: 50%;
        cursor: pointer;
        border: 1px solid #D0CFCF;
    }

    input:checked ~ label {
        border: 1px solid #00BDD3;
    }

    input:hover ~ label {
        border: 1px solid #00BDD3;
    }

    label:after {
        content: "";
        position: absolute;
        display: none;
        top: 5px;
        left: 5px;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background-color: #00BDD3;
    }

    input:checked ~ label:after {
        display: inline-block;
    }
}

.button_upload {
    display: flex;
    flex-direction: column;
    height: 54px;
    margin-top: 37px;

    label {
        display: flex;
        width: 100%;

        span {
            &:nth-child(1) {
                border: 1px solid rgba(0, 0, 0, 0.87);
                @include regular-font-styles;
                color: rgba(0, 0, 0, 0.87);
                padding: 14px 15px;
                border-radius: 4px 0px 0px 4px;
            }

            &:nth-child(2) {
                border: 1px solid #D0CFCF;
                border-radius: 0px 4px 4px 0px;
                width: 100%;
                @include regular-font-styles;
                padding-left: 16px;
                background-color: $background-color-body;
                display: flex;
                align-items: center;
                height: 100%;
            }
        }
    }
}

.hidden {
    display: none;
}

.error-text {
    color: #CB3D40;
    font-family: 'Asap', sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 14px;
    padding-left: 15px;
}

.form_success {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-family: $font-nunito;
    font-style: normal;
    font-weight: 400;
    font-size: 40px;
    line-height: 40px;
    background-color: $background-color-body;
    height: 100%;

    h1 {
        margin-bottom: 50px;
    }
}

.preloader_container {
    @include init-state;
    height: 100%;
    @include flex-center-row;
}

</style>