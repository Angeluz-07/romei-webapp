<template>
  <div id="app">
    <nav v-if="this.$store.state.userIsAuthenticated()" class="navbar navbar-expand-sm navbar-light bg-light">
      <a class="navbar-brand" href="#">My App</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
          <ul class="navbar-nav">
            <li class="nav-item">
              <router-link :to="{ name: 'home'}" class="nav-link">Registro</router-link>
            </li>
            <li class="nav-item">
              <router-link :to="{ name: 'paymentsQuery'}" class="nav-link">Consultas</router-link>
            </li>
          </ul>
          <ul class="navbar-nav ml-auto">
            <li class="nav-item navbar-text">
              <b> Logged in as {{ userName }} </b>|
              <a  href="#" v-on:click="logout()">Logout</a>
            </li>
          </ul>
      </div>
    </nav>
    <router-view v-on:loggedIn="loadUser"/>
  </div>
</template>

<script>
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min.js'

import { mapActions } from 'vuex'
import axios from 'axios';

axios.defaults.xsrfHeaderName = "X-CSRFToken"
axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.withCredentials = true

export default {
  name: 'App',
  data() {
    return {
      /*user : {
        name : ''
      }*/
    }
  },
  computed :{
    userName: function() {
      return this.$store.state.user.name;
    }
  },
  mounted () {
    if(this.$store.state.userIsAuthenticated()){
      this.loadUser();
    }
  },
  methods: {
    ...mapActions([
      'loadUser', 
    ]),
    logout() {
      const URL = `${this.$store.state.apiUrl}/logout`;
      axios.get(URL)
      .then(response => {
        console.log(response)
        localStorage.removeItem('isAuthenticated')
        this.$router.replace({ name: "logout" });
      })
      .catch(err => console.log(err.response))
    },/*
    loadUser() {
      const URL = `${this.$store.state.apiUrl}/who-am-i`;
      axios.get(URL)
      .then(response => {
        console.log(response);
        this.user.name = response.data.username ;
      })
      .catch(err => console.log(err.response))
    },*/
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
}
</style>
