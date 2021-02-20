<template>
        <table class="table table-bordered table-hover">
            <tbody>
                <tr>
                <td scope="col"> Ventas </td>
                <td scope="col">{{ this.salesRegisterCashSalesTotal }}</td>
                </tr>
                <tr>
                <td scope="col">$</td>
                <td scope="col">{{ this.paymentsRegistersValuesTotal  }}</td>
                </tr>
                <tr>
                <td scope="col"></td>
                <td scope="col" v-bind:class="diffStyle()"> {{ diff }} </td>
                </tr>
            </tbody>
        </table>
</template>

<script>

export default {
  name: 'SalesPaymentsDiff',
  props: ['registerDate','storeId'],
  data() {
    return {
      salesRegisterCashSalesTotal : null,
      paymentsRegistersValuesTotal: null
    }
  },
  computed: {
    diff: function(){
      let sales = this.salesRegisterCashSalesTotal ? this.salesRegisterCashSalesTotal : 0;
      let payments = this.paymentsRegistersValuesTotal ? this.paymentsRegistersValuesTotal : 0;
      return payments - sales;
    },
    excess: function() {
      return this.diff > 0
    },
    loss: function() {
      return this.diff < 0
    },
    balanced: function() {
      return this.diff === 0
    }
  },
  mounted() {
    if(this.storeId!==null){
      this.loadTotalSales();
      this.loadTotalPayments();
    }
  },
  methods: {
    loadTotalSales(){
      const URL = `${this.$store.state.apiUrl}/sales-registers/total?register_date=${this.registerDate}&store_id=${this.storeId}`;
      fetch(URL)
      .then(response => response.json())
      .then(responseJson => this.salesRegisterCashSalesTotal = responseJson.value)
      .then(()=> console.log(this.salesRegisterCashSalesTotal))
    },
    loadTotalPayments(){
      const URL = `${this.$store.state.apiUrl}/payments-registers/total?register_date=${this.registerDate}&store_id=${this.storeId}`;
      fetch(URL)
      .then(response => response.json())
      .then(responseJson => this.paymentsRegistersValuesTotal = responseJson.value)
      .then(()=> console.log(this.paymentsRegistersValuesTotal))
    },
    diffStyle(){
      if (this.loss) return "table-danger"
      else if (this.excess) return "table-warning"
      else if (this.balanced) return "table-success"
      else return ""
    }
  },
  components: {
  },
  watch: {
    registerDate() {
      this.loadTotalSales();
      this.loadTotalPayments();
    },
    storeId() {
      this.loadTotalSales();
      this.loadTotalPayments();
    }
  }
}
</script>

<style scoped>
</style>
