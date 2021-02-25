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
    stores: [],
    salesRegisters : [],
    salesRegisterCashSalesTotal : 0,
    paymentsRegisters : [],
    paymentsRegistersValuesTotal : 0,
  },
  mutations: {
    setApiUrl (state, url) {
      state.apiUrl = url;
    },
    updateUser (state, payload) {
      state.user = payload;
    },
    updateStores(state, payload) {
      state.stores = payload
    },
    updateSalesRegisterCashSalesTotal(state, value) {
      state.salesRegisterCashSalesTotal = value
    },
    updateSalesRegisters(state, payload) {
      state.salesRegisters = payload;
    },  
    updateSalesRegister_(state, payload) {
      let i = state.salesRegisters.findIndex(item => item.id == payload.id);
      state.salesRegisters[i] = payload;
    },
    updatePaymentsRegisters(state, payload) {
      state.paymentsRegisters = payload;
    },
    updatePaymentsRegister_(state, payload) {
      let i = state.paymentsRegisters.findIndex(item => item.id === payload.id);
      console.assert(i !== -1, "item not found");
      state.paymentsRegisters[i] = payload;
    },
    addPaymentsRegister_(state, payload){
      state.paymentsRegisters.push(payload);
    },
    deletePaymentsRegister_(state, payload) {
      const i = state.paymentsRegisters.findIndex(item => item.id === payload.id)
      console.assert(i !== -1, "item not found");
      state.paymentsRegisters.splice(i, 1);
    },
    updatePaymentsRegistersValuesTotal(state, value) {
      state.paymentsRegistersValuesTotal = value
    },
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
    },
    loadStores( {commit }){
      const URL = `${apiUrl}/stores`;
      axios.get(URL)
      .then(response => {
        console.log('stores',response)
        
        commit('updateStores', response.data);
        //this.stores = response.data;
        //let firstOption = this.stores[0].id;
        //this.storeId = firstOption;
      })
      .catch(err => console.log(err.response))
    },
    loadTotalSales( {commit } , payload){
      const URL = `${apiUrl}/sales-registers/total?register_date=${payload.registerDate}&store_id=${payload.storeId}`;
      axios.get(URL)
      .then(response => {
        console.log('sales registers total',response)
        //this.salesRegisterCashSalesTotal = response.data.value;
        commit("updateSalesRegisterCashSalesTotal", response.data.value)
        //this.$root.$emit('reloadTotalSales');
      })
      .catch(err => console.log(err.response))
    },
    loadSalesRegisters({commit}, payload){
      const URL = `${apiUrl}/sales-registers?register_date=${payload.registerDate}&store_id=${payload.storeId}&start=true`;
      axios.get(URL)
      .then(response => {
        console.log('sales registers',response)
        //this.salesRegisters = response.data;
        commit("updateSalesRegisters", response.data)
      })
      .catch(err => console.log(err.response))
    },
    loadPaymentsRegisters({commit}, payload){
      const URL = `${apiUrl}/payments-registers?register_date=${payload.registerDate}&store_id=${payload.storeId}`;
      axios.get(URL)
      .then(response => {
        console.log('payments registers',response)
        //this.paymentsRegisters = response.data;
        commit("updatePaymentsRegisters", response.data)
      })
      .catch(err => console.log(err.response))
    },
    loadTotalPayments( {commit } , payload){
      const URL = `${apiUrl}/payments-registers/total?register_date=${payload.registerDate}&store_id=${payload.storeId}`;
      axios.get(URL)
      .then(response => {
        console.log("Load total payments")
        commit("updatePaymentsRegistersValuesTotal", response.data.value)
        //this.$root.$emit('reloadTotalSales');
      })
      .catch(err => console.log(err.response))
    },
    updateSalesRegister( {commit}, payload){
      const URL = `${apiUrl}/sales-registers/${payload.id}`;
      return axios
      .patch(URL, payload.data)
      .then(response => {
           //this.$emit('reloadTotal')
          commit('updateSalesRegister_', response.data)
          console.log('update sale register',response)
      })
      .catch(err => console.log(err.response))
    },
    createPaymentsRegister({ commit}, payload){
      const URL = `${apiUrl}/payments-registers`;
      return axios.post(URL, payload.data)
      .then(response => {
        console.log('create payments registers', response)
        commit('addPaymentsRegister_', response.data)
        //this.$root.$emit('reloadTotalPayments')
      })
      .catch(err => console.log(err.response))
    },
    updatePaymentsRegister( {commit}, payload){
      const URL = `${apiUrl}/payments-registers/${payload.id}`;
      return axios
      .patch(URL, payload.data)
      .then(response => {
          //this.$emit('reloadTotal')
          commit('updatePaymentsRegister_', response.data)
          console.log('update pay register', response)
      })
      .catch(err => console.log(err.response))
    },
    deletePaymentsRegister( {commit}, payload) {
      const URL = `${apiUrl}/payments-registers/${payload.id}`;
      return axios.delete(URL)
      .then(()=>{
        commit('deletePaymentsRegister_', payload)
        //this.loadPaymentsRegisters()
        //this.loadTotal()
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
