<template>
  <div id="app">
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <a class="navbar-brand" href="#">Cuadre</a>
    <a class="navbar-brand" href="#">Previos</a>
  </nav>
    <input type="date" class="form-control" v-model="registerDate">
    <!--Sheet  v-for="store in stores" :key="store.id" :products="store.allProducts.products"/-->

    <Sheet  />
  </div>
</template>

<script>
//import HelloWorld from './components/HelloWorld.vue'

//import Vue from 'vue'
//import BootstrapVue  from 'bootstrap-vue'

import Sheet  from './components/Sheet.vue'
import 'bootstrap/dist/css/bootstrap.css'
//import 'bootstrap-vue/dist/bootstrap-vue.css'

//const axios = require('axios');
//Vue.use(BootstrapVue)
//const BASE_URL = 'http://localhost:5000/graphql';


export default {
  name: 'App',
  data() {
    return {
      stores : [],
      registerDate : this.today(),
    }
  },
  mounted () {
    /*axios
      .post(BASE_URL,{
        //query : QUERY,
        query : QUERY2("2020-09-30")
      })
      .then((response) => {
        // handle success
        console.log(response);
        console.log(QUERY2(this.registerDate))
        this.stores = response.data.data.allStores.stores;
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })*/
  },
  methods: {
    today(){
      var today = new Date();
      var dd = String(today.getDate()).padStart(2, '0');
      var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
      var yyyy = today.getFullYear();

      return `${yyyy}-${mm}-${dd}`
    }
  },
  components: {
    Sheet
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
