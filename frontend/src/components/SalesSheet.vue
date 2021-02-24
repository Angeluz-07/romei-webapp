<template>
        <table class="table table-bordered table-hover">
            <tbody>                
                <SalesSheetRow
                  v-for="salesRegister in salesRegisters"
                  :key="salesRegister.id"
                  :salesRegister="salesRegister"
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
</template>

<script>

import SalesSheetRow from './SalesSheetRow.vue'

export default {
  name: 'SalesSheet',
  computed: {
    salesRegisterCashSalesTotal : function(){
      return this.$store.state.salesRegisterCashSalesTotal 
    },
    salesRegisters : function () {
      return this.$store.state.salesRegisters;
    }
  },
  components: {
    SalesSheetRow
  },
}
</script>

<style scoped>
</style>
