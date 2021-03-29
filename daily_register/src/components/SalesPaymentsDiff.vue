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
  computed: {
    salesRegisterCashSalesTotal : function(){
      return this.$store.state.dailyRegister.sale.total
    },
    paymentsRegistersValuesTotal : function(){
      return this.$store.state.dailyRegister.payment.total
    },
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
  methods: {
    diffStyle(){
      if (this.loss) return "table-danger"
      else if (this.excess) return "table-warning"
      else if (this.balanced) return "table-success"
      else return ""
    }
  },
}
</script>

<style scoped>
</style>
