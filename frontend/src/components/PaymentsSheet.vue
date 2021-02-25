<template>
  <div>
    <div id="payments">
      <table class="table table-bordered table-hover">
          <!--thead>
              <tr>
              <th scope="col"></th>
              <th scope="col">Valor</th>
              <th scope="col">Nombre</th>
              <th scope="col">Descripcion</th>
              <th scope="col"></th>
              </tr>
          </thead-->
          <tbody>
              <PaymentsSheetRow
                v-for="paymentsRegister in paymentsRegisters"
                :key="paymentsRegister.id"
                :paymentsRegister="paymentsRegister"
                v-on:removePaymentsRegister="removePaymentsRegister"
              />

              <tr>
              <td style="width:5%"></td>
              <td style="width:15%"><input v-model="value"  type="text" class="form-control text-right"></td>
              <td style="width:25%" ><input v-model="name" type="text" class="form-control"></td>
              <td><input v-model="description"  type="text" class="form-control"></td>
              <td><button type="button" class="btn btn-secondary"  @click="addPaymentsRegister">+</button></td>
              </tr>
            
              <tr>
              <td></td>
              <td scope="col" class="text-right pr-4">{{ this.paymentsRegistersValuesTotal }}</td>
              <td scope="col"></td>
              <td scope="col"></td>
              <td scope="col"></td>
              </tr>
          </tbody>
      </table>
    </div>
  </div>
</template>

<script>

import PaymentsSheetRow from './PaymentsSheetRow.vue'

export default {
  name: 'PaymentsSheet',
  props:['storeId','registerDate'],
  data() {
    return {
      loading: false,
      value: 0,
      name : "",
      description : "",
    }
  },
  computed: {
    paymentsRegistersValuesTotal : function(){
      return this.$store.state.paymentsRegistersValuesTotal 
    },
    paymentsRegisters : function () {
      return this.$store.state.paymentsRegisters;
    }
  },
  mounted() {
  },
  methods: {
    addPaymentsRegister(){
      let payload = {
        data: {
          name: this.name,
          description: this.description,
          value : this.value,
          store: this.storeId,
          register_date: this.registerDate
        }
      }
      this.loading = true
      this.$store
      .dispatch('createPaymentsRegister', payload)
      .then(()=> this.loading = false)
      .then(()=> {
        this.value = 0;
        this.name = this.description = "";
      })
    },
    removePaymentsRegister(id){
      let payload = {
        id: id
      }
      this.loading = true
      this.$store
      .dispatch('deletePaymentsRegister', payload)
      .then(()=> this.loading = false)
    },
  },
  components: {
    PaymentsSheetRow
  },
}
</script>

<style scoped>
#payments {
  height:50vh;
  overflow-y:scroll;
}
</style>
