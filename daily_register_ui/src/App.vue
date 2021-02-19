<template>
  <div id="app">
    <nav  v-if="userIsAuthenticated()" class="navbar navbar-light bg-light">
      <a class="navbar-brand">My App</a>
      <div>
        <b> Logged in as {{ this.user.name }} </b>|
        <button type="button" class="btn btn-link" v-on:click="logout()">
          Logout
        </button>
      </div>
    </nav>
    <router-view v-on:loggedIn="loadUser"/>
  </div>
</template>

<script>
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min.js'

import axios from 'axios';

axios.defaults.xsrfHeaderName = "X-CSRFToken"
axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.withCredentials = true

export default {
  name: 'App',
  data() {
    return {
      user : {
        name : ''
      }
    }
  },
  mounted () {
    if(this.userIsAuthenticated()){
      this.loadUser();
    }
  },
  methods: {
    logout() {
      const URL = `${this.$store.state.apiUrl}/logout`;
      axios.get(URL)
      .then(response => {
        console.log(response)
        localStorage.removeItem('isAuthenticated')
        this.$router.replace({ name: "logout" });
      })
      .catch(err => console.log(err.response))
    },
    userIsAuthenticated(){
      return Boolean(localStorage.getItem("isAuthenticated"))
    },
    loadUser() {
      const URL = `${this.$store.state.apiUrl}/who-am-i`;
      axios.get(URL)
      .then(response => {
        console.log(response);
        this.user.name = response.data.username ;
      })
      .catch(err => console.log(err.response))
  },
  },
  watch: {
  },
  components: {
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
