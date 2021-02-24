<template>
  <div class="container-fluid">
    <div class="row my-3">
      <div class="col-8">
        <input type="date" class="form-control" v-model="registerDate">
      </div>
      <div class="col-4">
        <select class="form-control" v-model="storeId">
          <option v-for="store in stores" :key="store.id" :value="store.id">{{store.name}}</option>
        </select>
      </div>
    </div>
    <div class="row my-3">
      <div class="col-12">
        <nav>
          <div class="nav nav-tabs" id="nav-tab" role="tablist">
            <a class="nav-link active" id="nav-home-tab" data-toggle="tab" href="#nav-sales-registers" role="tab" aria-controls="nav-home" aria-selected="true">Ventas</a>
            <a class="nav-link" id="nav-profile-tab" data-toggle="tab" href="#nav-payments-registers" role="tab" aria-controls="nav-profile" aria-selected="false">Apuntes</a>
            <a class="nav-link" id="nav-profile-tab" data-toggle="tab" href="#nav-sales-payments-diff" role="tab" aria-controls="nav-profile" aria-selected="false">Cuadre</a>
          </div>
        </nav>
        <div class="tab-content my-3" id="nav-tabContent">
          <div class="tab-pane fade show active" id="nav-sales-registers" role="tabpanel" aria-labelledby="nav-home-tab">
            <SalesSheet :registerDate="this.registerDate" :storeId="this.storeId"/>
          </div>
          <div class="tab-pane fade" id="nav-payments-registers" role="tabpanel" aria-labelledby="nav-profile-tab">
            <PaymentsSheet :registerDate="this.registerDate" :storeId="this.storeId" />
          </div>
          <div class="tab-pane fade" id="nav-sales-payments-diff" role="tabpanel" aria-labelledby="nav-profile-tab">
            <SalesPaymentsDiff :registerDate="this.registerDate" :storeId="this.storeId" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SalesSheet  from './SalesSheet.vue'
import PaymentsSheet from './PaymentsSheet.vue'
import SalesPaymentsDiff from './SalesPaymentsDiff.vue'
import { mapActions } from 'vuex'

import axios from 'axios';

axios.defaults.xsrfHeaderName = "X-CSRFToken"
axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.withCredentials = true


export default {
  name: 'App',
  data() {
    return {
      //stores : [],
      registerDate : this.today(),
      storeId: -1
    }
  },
  computed: {
    stores: function(){
      return  this.$store.state.stores
    }
  },
  mounted () {
    this.loadStores();
  },
  methods: {
    ...mapActions([
      'loadStores', 
    ]),
    today(){
      var today = new Date();
      var dd = String(today.getDate()).padStart(2, '0');
      var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
      var yyyy = today.getFullYear();

      return `${yyyy}-${mm}-${dd}`
    },
    /*
    loadStores(){
      const URL = `${this.$store.state.apiUrl}/stores`;
      axios.get(URL)
      .then(response => {
        console.log('stores',response)
        this.stores = response.data;
        let firstOption = this.stores[0].id;
        this.storeId = firstOption;
      })
      .catch(err => console.log(err.response))
    },*/
  },
  components: {
    SalesSheet,
    PaymentsSheet,
    SalesPaymentsDiff
  },
}
</script>

<style>
</style>
