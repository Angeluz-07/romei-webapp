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
    paymentsQuery : {
      registers : [],
      total : 0
    },
    dailyRegister : {
      registerDate : '',
      storeId : -1,
      sale : {
        registers : [],
        total : 0
      },
      payment : {
        registers : [],
        total : 0 
      },
    },
    stores: [],
  },
  mutations: {
    setApiUrl (state, url) {
      state.apiUrl = url;
    },
    updateUser (state, payload) {
      state.user = payload;
    },
    updateStores (state, payload) {
      state.stores = payload
    },
    updateDailyRegister (state, payload) {
      state.dailyRegister = payload;
    },
    updateSale (state, payload) {
      state.dailyRegister.sale = payload;
    },
    updateSaleRegister(state, payload) {
      let i = state.dailyRegister.sale.registers.findIndex(item => item.id == payload.id);
      console.assert(i !== -1, "item not found");
      state.dailyRegister.sale.registers[i] = payload;
    },
    updatePayment (state, payload) {
      state.dailyRegister.payment = payload;
    },
    createPaymentRegister(state, payload){
      state.dailyRegister.payment.registers.push(payload);
    },
    updatePaymentRegister(state, payload) {
      let i = state.dailyRegister.payment.registers.findIndex(item => item.id === payload.id);
      console.assert(i !== -1, "item not found");
      state.dailyRegister.payment.registers[i] = payload;
    },
    deletePaymentRegister(state, payload) {
      const i = state.dailyRegister.payment.registers.findIndex(item => item.id === payload.id)
      console.assert(i !== -1, "item not found");
      state.dailyRegister.payment.registers.splice(i, 1);
    },
  },
  actions: {
    loadUser({ commit }) {
      const URL = `${apiUrl}/who-am-i`;
      axios.get(URL)
      .then(response => {
        commit('updateUser', { name: response.data.username });
      })
      .catch(err => console.log(err.response))
    },
    loadStores({ commit }){
      const URL = `${apiUrl}/stores`;
      return axios.get(URL)
      .then(response => {
        commit('updateStores', response.data);
      })
      .catch(err => console.log(err.response))
    },
    loadSaleRegisters({ commit, state }){
      const registerDate = state.dailyRegister.registerDate;
      const storeId = state.dailyRegister.storeId;
      const URL = `${apiUrl}/sale-registers?register_date=${registerDate}&store_id=${storeId}&start=true`;
      axios.get(URL)
      .then(response => {
        let payload = {...state.dailyRegister.sale, registers : response.data}
        commit("updateSale", payload)
      })
      .catch(err => console.log(err.response))
    },
    loadSaleTotal({ commit, state }){
      const registerDate = state.dailyRegister.registerDate;
      const storeId = state.dailyRegister.storeId;
      const URL = `${apiUrl}/sale-registers/total?register_date=${registerDate}&store_id=${storeId}`;
      axios.get(URL)
      .then(response => {
        let payload = {...state.dailyRegister.sale, total: response.data.value }
        commit("updateSale", payload)
      })
      .catch(err => console.log(err.response))
    },
    loadPaymentRegisters({ commit, state }){
      const registerDate = state.dailyRegister.registerDate;
      const storeId = state.dailyRegister.storeId;
      const URL = `${apiUrl}/payment-registers?register_date=${registerDate}&store_id=${storeId}`;
      axios.get(URL)
      .then(response => {
        let payload = {...state.dailyRegister.payment, registers : response.data}
        commit("updatePayment", payload)
      })
      .catch(err => console.log(err.response))
    },
    loadPaymentTotal({ commit, state }){
      const registerDate = state.dailyRegister.registerDate;
      const storeId = state.dailyRegister.storeId;
      const URL = `${apiUrl}/payment-registers/total?register_date=${registerDate}&store_id=${storeId}`;
      axios.get(URL)
      .then(response => {
        let payload = {...state.dailyRegister.payment, total: response.data.value }
        commit("updatePayment", payload)
      })
      .catch(err => console.log(err.response))
    },
    updateSaleRegister({ commit }, payload){
      const URL = `${apiUrl}/sale-registers/${payload.id}`;
      return axios
      .patch(URL, payload.data)
      .then(response => {
        commit('updateSaleRegister', response.data)
      })
      .catch(err => console.log(err.response))
    },
    createPaymentRegister({ commit }, payload){
      const URL = `${apiUrl}/payment-registers`;
      return axios
      .post(URL, payload.data)
      .then(response => {
        commit('createPaymentRegister', response.data)
      })
      .catch(err => console.log(err.response))
    },
    updatePaymentRegister({ commit }, payload){
      const URL = `${apiUrl}/payment-registers/${payload.id}`;
      return axios
      .patch(URL, payload.data)
      .then(response => {
        commit('updatePaymentRegister', response.data)
      })
      .catch(err => console.log(err.response))
    },
    deletePaymentRegister({ commit }, payload) {
      const URL = `${apiUrl}/payment-registers/${payload.id}`;
      return axios.delete(URL)
      .then(() => {
        commit('deletePaymentRegister', payload)
      })
      .catch(err => console.log(err.response))
    },
    loadDailyRegister({ commit, state }, payload){
      let _payload = {...state.dailyRegister, storeId: payload.storeId, registerDate: payload.registerDate}
      commit('updateDailyRegister',_payload);
      this.dispatch('loadSaleRegisters');
      this.dispatch('loadSaleTotal');
      this.dispatch('loadPaymentRegisters');
      this.dispatch('loadPaymentTotal');
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
