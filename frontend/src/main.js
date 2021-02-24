import Vue from 'vue'
import App from './App.vue'

import Login from './components/Login.vue'
import DailyRegister from './components/DailyRegister.vue'
import PaymentsQuery from './components/PaymentsQuery.vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'

import axios from 'axios';

axios.defaults.xsrfHeaderName = "X-CSRFToken"
axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.withCredentials = true

Vue.use(Vuex)
Vue.use(VueRouter)

Vue.config.productionTip = false
const store = new Vuex.Store({
  state: {
    apiUrl: null,
    userIsAuthenticated: () => Boolean(localStorage.getItem("isAuthenticated")),
    user: {
      name: ''
    },
  },
  mutations: {
    setApiUrl (state, url) {
      state.apiUrl = url;
    },
    updateUser (state, payload) {
      state.user = payload;
    }
  },
  actions: {
    loadUser({ commit }) {
      const URL = `${apiUrl}/who-am-i`;
      axios.get(URL)
      .then(response => {
        console.log("called", response);
        commit('updateUser', {
            name: response.data.username
        });
        //this.user.name = response.data.username ;
      })
      .catch(err => console.log(err.response))
    }
  }
})

const apiUrl = process.env.VUE_APP_API_URL ? `${process.env.VUE_APP_API_URL}/api` : '/api';
store.commit('setApiUrl', apiUrl);


const requireAuthenticated = (to, from, next) => {
  if(!store.state.userIsAuthenticated()){
    console.log("redirecting not authenticated")
    next('/login')
  } else {
    next()
  }
};

const redirectIfAuthenticated = (to, from, next) => {
  if(store.state.userIsAuthenticated()){
    console.log("redirecting authenticated")
    next({name:'home'})
  } else {
    next()
  }
};

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
      component: Login,
      beforeEnter: redirectIfAuthenticated,
    },
    {
      path: "/daily-register",
      name: "home",
      component: DailyRegister,
      beforeEnter: requireAuthenticated,
    },
    {
      path: "/payments-query",
      name: "paymentsQuery",
      component: PaymentsQuery,
      beforeEnter: requireAuthenticated,
    },
    {
      path: '/logout',
      name: "logout",
      redirect: {
        name: "login"
      }
    },
  ]
})


new Vue({
  router: router,
  store: store,
  render: h => h(App)
}).$mount('#app')
