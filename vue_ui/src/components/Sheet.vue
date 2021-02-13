<template>
    <div>
        <p>Puesto x</p>
        <table class="table table-bordered table-hover">
            <thead>
                <tr>
                <th scope="col"></th>
                <th scope="col"></th>
                <th scope="col"></th>                
                <th scope="col"></th>
                <th scope="col"></th>
                <th scope="col"></th> 
                <th scope="col"></th>                              
                <th scope="col"></th>
                </tr>
            </thead>
            <tbody>                
                <SheetRow  v-for="salesRegister in salesRegisters" :key="salesRegister.id" :salesRegister="salesRegister" />
                <tr>
                <td scope="col"></td>
                <td scope="col"></td>
                <td scope="col"></td>                
                <td scope="col"></td>
                <td scope="col"></td>
                <td scope="col"></td>
                <td scope="col"></td>
                <td scope="col">{{ this.cashSales }}</td>
                </tr>
            </tbody>
        </table>
        <button type="button" class="btn btn-secondary" @click="saveData">Guardar</button>
    </div>
</template>

<script>

import SheetRow from './SheetRow.vue'
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const BASE_URL = 'http://localhost:8000/dailyControl/api';

const cashSalesStore = new Vuex.Store({
  state: {
    cashSales: null,
  },
  mutations: {
    setCashSales (state, salesRegisters) {
      state.cashSales = salesRegisters.map((x) => ({
          'salesRegisterId': x.id,
          'cashSale': x.cash_sale
        })
      );
    },
    updateCashSale (state, payload) {
      const result = state.cashSales.find(x => x.salesRegisterId === payload.salesRegisterId);
      result.cashSale = payload.cashSale;
    }
  },
  getters: {
    cashSalesSum: state => {
      return state.cashSales ?
      state.cashSales
      .map(x => x.cashSale)
      .reduce((a,b)=>a+b, 0) : 0 ;
    }
  }
})

export default {
  name: 'Sheet',
  props: ['registerDate','storeId'],
  store: cashSalesStore,
  data() {
    return {
      salesRegisters : null,
    }
  },
  computed: {
    cashSales : function (){
      return this.$store.getters.cashSalesSum;
    }
  },
  mounted() {
    if(this.storeId!==null){
      this.loadSalesRegisters();
    }
  },
  methods: {
    loadSalesRegisters(){
      const URL = `${BASE_URL}/sales-registers?register_date=${this.registerDate}&store_id=${this.storeId}&start=true`;
      fetch(URL)
      .then(response => response.json())
      .then(salesRegisters => this.salesRegisters = salesRegisters)
      .then(() => this.$store.commit('setCashSales', this.salesRegisters))
      .then(() => console.log(this.$store.state.cashSales))
    },
    saveData(){
      console.log(this.salesRegisters);
    }
  },
  components: {
    SheetRow
  },
  watch: {
    registerDate() {
      this.loadSalesRegisters();
    },
    storeId() {
      this.loadSalesRegisters();
    }
  }
}
</script>

<style scoped>
</style>
