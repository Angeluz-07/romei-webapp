<template>
  <div id="app">
    <DailyRegister/>
  </div>
</template>

<script>
/*
  Use boostrap assets placed in django. As when
  put bootstrap twice causes some boostraps function
  to break, specifically nav-bar. https://stackoverflow.com/a/24674182/6819659
*/
//import 'bootstrap/dist/css/bootstrap.min.css'
//import 'bootstrap/dist/js/bootstrap.min.js'

import DailyRegister from './components/DailyRegister.vue'

export default {
  name: 'App',
  data() {
    return {
    }
  },
  computed :{
  },
  mounted () {
  },
  methods: {
  },
  watch: {
  },
  components: {
    DailyRegister
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
