import Vue from 'vue'
import App from './App.vue'

import Login from './components/Login.vue'
import DailyRegister from './components/DailyRegister.vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'

Vue.use(Vuex)
Vue.use(VueRouter)

Vue.config.productionTip = false

const router = new VueRouter({
  routes: [
    {
      path: '/',
      redirect: {
        name: "login"
      }
    },
    {
      path: "/login",
      name: "login",
      component: Login
    },
    {
      path: "/app",
      name: "app",
      component: DailyRegister
    }
  ]
})


const store = new Vuex.Store({
  state: {
    apiUrl: null,
  },
  mutations: {
    setApiUrl (state, url) {
      state.apiUrl = url;
    }
  }
})

const apiUrl = "http://localhost:8000/dailyControl/api";
store.commit('setApiUrl', apiUrl);

new Vue({
  router: router,
  store: store,
  render: h => h(App)
}).$mount('#app')
