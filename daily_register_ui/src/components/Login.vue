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
    methods: {
        login() {
            console.log("Login Clicked");
        }
    }
}
</script>

<style scoped>
</style>
