<template>
  <div id="salesSheet">
        <table class="table table-bordered table-hover">
            <tbody>                
                <SalesSheetRow
                  v-for="saleRegister in saleRegisters"
                  :key="saleRegister.id"
                  :saleRegister="saleRegister"
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
                <td scope="col">{{ this.saleRegistersCashSaleTotal }}</td>
                </tr>
            </tbody>
        </table>
  </div>
</template>

<script>

import SalesSheetRow from './SalesSheetRow.vue'

export default {
  name: 'SalesSheet',
  computed: {
    saleRegistersCashSaleTotal : function(){
      return this.$store.state.dailyRegister.sale.total; 
    },
    saleRegisters : function () {
      return this.$store.state.dailyRegister.sale.registers;
    }
  },
  components: {
    SalesSheetRow
  },
}
</script>

<style scoped>
table {
  width:1000px;
}

#salesSheet {
  overflow-x: scroll;
}
</style>
