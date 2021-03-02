<template>
  <div>
    <div id="payments" class="border-top">
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
              <td style="width:8%" class="px-2"><input v-model="value"  type="text" class="form-control text-right px-1"></td>
              <td style="">
                <textarea 
                  v-model="description"
                  class="form-control"
                  oninput='this.style.height = "";this.style.height = this.scrollHeight + 3 + "px"'
                  >
                </textarea>
              </td>
              <td style="width:2%"><button type="button" class="btn btn-secondary"  @click="addPaymentsRegister">+</button></td>
              </tr>
            
              <tr>
              <td></td>
              <td scope="col" class="text-right pr-4">{{ this.paymentsRegistersValuesTotal }}</td>
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
      value: '',
      description : "",
    }
  },
  computed: {
    paymentsRegistersValuesTotal : function(){
      return this.$store.state.dailyRegister.payment.total
    },
    paymentsRegisters : function () {
      return this.$store.state.dailyRegister.payment.registers;
    }
  },
  mounted() {
  },
  methods: {
    addPaymentsRegister(){
      let _value = this.value==='' ? 0 : this.value;
      let payload = {
        data: {
          description: this.description,
          value : _value,
          store: this.storeId,
          register_date: this.registerDate
        }
      }
      this.loading = true
      this.$store
      .dispatch('createPaymentRegister', payload)
      .then(()=> this.loading = false)
      .then(() => this.$store.dispatch('loadPaymentTotal'))
      .then(()=> {
        this.value = '';
        this.description = "";
      })
    },
    removePaymentsRegister(id, value, description){
      if(confirm(`Esta seguro de querer eliminar el registro [$${value} ; ${description}]?`)) {
        let payload = {
          id: id
        }
        this.loading = true
        this.$store
        .dispatch('deletePaymentRegister', payload)
        .then(()=> this.loading = false)
        .then(() => this.$store.dispatch('loadPaymentTotal'))
      }
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
