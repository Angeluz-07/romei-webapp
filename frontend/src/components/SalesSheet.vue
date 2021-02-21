<template>
        <table class="table table-bordered table-hover">
            <tbody>                
                <SalesSheetRow
                  v-for="salesRegister in salesRegisters"
                  :key="salesRegister.id"
                  :salesRegister="salesRegister"
                  v-on:reloadTotal="loadTotal"
                />
                <tr>
                <td scope="col"></td>
                <td scope="col"></td>
                <td scope="col"></td>
                <td scope="col"></td>                
                <td scope="col"></td>
                <td scope="col"></td>
                <td scope="col"></td>
                <td scope="col"></td>
                <td scope="col">{{ this.salesRegisterCashSalesTotal }}</td>
                </tr>
            </tbody>
        </table>
        <!--button type="button" class="btn btn-secondary" @click="saveData">Guardar</button-->
</template>

<script>

import SalesSheetRow from './SalesSheetRow.vue'

import axios from 'axios';

axios.defaults.xsrfHeaderName = "X-CSRFToken"
axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.withCredentials = true

export default {
  name: 'SalesSheet',
  props: ['registerDate','storeId'],
  data() {
    return {
      salesRegisters : null,
      salesRegisterCashSalesTotal : null,
    }
  },
  computed: {
  },
  mounted() {
    if(this.storeId!==null){
      this.loadSalesRegisters();
      this.loadTotal();
    }
  },
  methods: {
    loadSalesRegisters(){
      const URL = `${this.$store.state.apiUrl}/sales-registers?register_date=${this.registerDate}&store_id=${this.storeId}&start=true`;
      axios.get(URL)
      .then(response => {
        console.log('sales registers',response)
        this.salesRegisters = response.data;
      })
      .catch(err => console.log(err.response))
      /*
      fetch(URL)
      .then(response => response.json())
      .then(salesRegisters => this.salesRegisters = salesRegisters)*/
    },
    loadTotal(){
      const URL = `${this.$store.state.apiUrl}/sales-registers/total?register_date=${this.registerDate}&store_id=${this.storeId}`;
      axios.get(URL)
      .then(response => {
        console.log('sales registers total',response)
        this.salesRegisterCashSalesTotal = response.data.value;
        this.$root.$emit('reloadTotalSales');
      })
      .catch(err => console.log(err.response))

      /*fetch(URL)
      .then(response => response.json())
      .then(responseJson => {
        this.salesRegisterCashSalesTotal = responseJson.value
        this.$root.$emit('reloadTotalSales');
      })
      .then(()=> console.log(this.salesRegisterCashSalesTotal))*/
    },
    saveData(){
      console.log(this.salesRegisters);
    }
  },
  components: {
    SalesSheetRow
  },
  watch: {
    registerDate() {
      this.loadSalesRegisters();
      this.loadTotal();
    },
    storeId() {
      this.loadSalesRegisters();
      this.loadTotal();
    }
  }
}
</script>

<style scoped>
</style>
