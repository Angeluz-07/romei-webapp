import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

new Vue({
  render: h => h(App, {
    props:{
      apiUrl: "http://localhost:8000/dailyControl/api"
    }
  })
}).$mount('#app')
