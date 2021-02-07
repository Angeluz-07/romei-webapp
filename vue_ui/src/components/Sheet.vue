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
                <SheetRow  v-for="product in products" :key="product.id" :product="product" />
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

const BASE_URL = 'http://localhost:4000/api';

const cashSalesStore = new Vuex.Store({
  state: {
    cashSales: null,
  },
  mutations: {
    setCashSales (state, products) {
      state.cashSales = products.map((x) => ({
          'productId': x.id,
          'cashSale': 0
        })
      );
    },
    updateCashSale (state, payload) {
      const result = state.cashSales.find(x => x.productId === payload.productId);
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
  store: cashSalesStore,
  data() {
    return {
      products : null,
    }
  },
  computed: {
    cashSales : function (){
      return this.$store.getters.cashSalesSum;
    }
  },
  mounted() {
    this.loadProducts();
  },
  methods: {
    loadProducts(){
      const URL = `${BASE_URL}/products`;
      fetch(URL)
      .then(response => response.json())
      .then(responseJson => this.products = responseJson.data)
      .then(() => this.$store.commit('setCashSales', this.products))
      .then(() => console.log(this.$store.state.cashSales))
    },
    saveData(){
      console.log(this.products);
    }
  },
  components: {
    SheetRow
  }
}
</script>

<style scoped>
</style>
