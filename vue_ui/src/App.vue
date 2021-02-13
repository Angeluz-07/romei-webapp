<template>
  <div id="app">
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <a class="navbar-brand" href="#">Cuadre</a>
    <a class="navbar-brand" href="#">Previos</a>
  </nav>
    <input type="date" class="form-control" v-model="registerDate">
    <select v-model="storeId">
      <option v-for="store in stores" :key="store.id" :value="store.id">{{store.name}}</option>
    </select>
    <!--Sheet  v-for="store in stores" :key="store.id" :products="store.allProducts.products"/-->

    <SalesSheet :registerDate="this.registerDate" :storeId="this.storeId"/>
  </div>
</template>

<script>
//import HelloWorld from './components/HelloWorld.vue'

//import Vue from 'vue'
//import BootstrapVue  from 'bootstrap-vue'

import SalesSheet  from './components/SalesSheet.vue'
import 'bootstrap/dist/css/bootstrap.css'
//import 'bootstrap-vue/dist/bootstrap-vue.css'

//const axios = require('axios');
//Vue.use(BootstrapVue)
//const BASE_URL = 'http://localhost:5000/graphql';
const BASE_URL = 'http://localhost:8000/dailyControl/api';


export default {
  name: 'App',
  data() {
    return {
      stores : [],
      registerDate : this.today(),
      storeId: null
    }
  },
  mounted () {
    this.loadStores();
  },
  methods: {
    today(){
      var today = new Date();
      var dd = String(today.getDate()).padStart(2, '0');
      var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
      var yyyy = today.getFullYear();

      return `${yyyy}-${mm}-${dd}`
    },
    loadStores(){
      const URL = `${BASE_URL}/stores`;
      fetch(URL)
      .then(response => response.json())
      .then(stores => this.stores = stores)
      .then(() => console.log(this.stores))
    },
  },
  components: {
    SalesSheet
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
