<template>
    <div class="container-fluid">
        <div class="row my-3 mx-auto w-25">
            <h1>Login</h1>
        </div>
        <div class="row my-3 mx-auto w-25">
            <input
                class="form-control"
                type="text"
                name="username"
                v-model="input.username"
                placeholder="Username" />
        </div>
        <div class="row my-3 mx-auto w-25">
            <input
                class="form-control"
                type="password"
                name="password"
                v-model="input.password"
                placeholder="Password" />
        </div>
        <div class="row my-3 mx-auto w-25">
            <button type="button" class="btn btn-secondary" v-on:click="login()">
            Login
            </button>
        </div>
    </div>
</template>

<script>

import axios from 'axios';

axios.defaults.xsrfHeaderName = "X-CSRFToken"
axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.withCredentials = true

export default {
    name: 'Login',
    data() {
        return {
            input: {
                username: "",
                password: ""
            }
        }
    },
    mounted() {
        this.setCSRF();
    },
    methods: {
        login() {
            let _data = {
                username : this.input.username,
                password : this.input.password
            }
            const URL = `${this.$store.state.apiUrl}/login`;
            axios.post(URL,_data)
            .then(response => {
                console.log(response)
                localStorage.setItem('isAuthenticated', true)
                this.$emit('loggedIn');
                this.$router.push({name: 'app'})
            })
            .catch(err => console.log(err.response))
        },
        setCSRF() {
            const URL = `${this.$store.state.apiUrl}/set-csrf`;
            fetch(URL,{
                credentials: "include"
            })
            .then(response => response.json())
            .then(responseJson => console.log(responseJson))
        }
    }
}
</script>

<style scoped>
</style>
