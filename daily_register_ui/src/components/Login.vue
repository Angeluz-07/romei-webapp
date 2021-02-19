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
             <button type="button" class="btn btn-secondary" v-on:click="whoami()">
            Check user
            </button>
             <button type="button" class="btn btn-secondary" v-on:click="logout()">
            Logout
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
    mounted() {
        this.setCSRF();
    },
    methods: {
        whoami() {
            const URL = `${this.$store.state.apiUrl}/who-am-i`;
            fetch(URL, {
                headers : {
                    "Content-Type": "application/json",
                    "X-CSRFToken": this.$cookies.get("csrftoken")
                },
                credentials: "include"
            })
            .then(response => response.json())
            .then(json => console.log(json))
            .catch(err => console.log(err))
        },
        login() {
            let _data = {
                username : this.input.username,
                password : this.input.password
            }
            const URL = `${this.$store.state.apiUrl}/login`;
            fetch(URL, {
                method: "POST",
                body: JSON.stringify(_data),
                headers : {
                    "Content-Type": "application/json",
                    "X-CSRFToken": this.$cookies.get("csrftoken")
                },
                credentials: "include"
            })
            .then(response => response.json())
            .then(json => console.log(json))
            .catch(err => console.log(err))

        },
        logout() {
            const URL = `${this.$store.state.apiUrl}/logout`;
            fetch(URL, {
                headers : {
                    "Content-Type": "application/json",
                    "X-CSRFToken": this.$cookies.get("csrftoken")
                },
                credentials: "include"
            })
            .then(response => response.json())
            .then(json => console.log(json))
            .catch(err => console.log(err))

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
