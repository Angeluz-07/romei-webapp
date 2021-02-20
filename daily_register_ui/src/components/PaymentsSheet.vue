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
                v-on:reloadTotal="loadTotal"
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
  props: ['registerDate','storeId'],
  data() {
    return {
      loading: false,
      paymentsRegisters : [],
      paymentsRegistersValuesTotal : null,
      value: 0,
      name : "",
      description : "",
    }
  },
  computed: {
  },
  mounted() {
    if(this.storeId!==null){
      this.loadPaymentsRegisters();
      this.loadTotal();
    }
  },
  methods: {
    loadPaymentsRegisters(){
      const URL = `${this.$store.state.apiUrl}/payments-registers?register_date=${this.registerDate}&store_id=${this.storeId}`;
      fetch(URL)
      .then(response => response.json())
      .then(paymentsRegisters => this.paymentsRegisters = paymentsRegisters)
      .then(()=> console.log(this.paymentsRegisters))
    },
    loadTotal(){
      const URL = `${this.$store.state.apiUrl}/payments-registers/total?register_date=${this.registerDate}&store_id=${this.storeId}`;
      fetch(URL)
      .then(response => response.json())
      .then(responseJson => {
        this.paymentsRegistersValuesTotal = responseJson.value
        this.$root.$emit('reloadTotalPayments');
      })
      .then(()=> console.log(this.paymentsRegistersValuesTotal))
    },
    addPaymentsRegister(){
      this.paymentsRegisters.push({
        value: this.value,
        name: this.name,
        description: this.description
      })
      this.createPaymentsRegister();
      this.value = 0;
      this.name = this.description = "";
    },
    createPaymentsRegister(){
      let _data = {
        name: this.name,
        description: this.description,
        value : this.value,
        store: this.storeId,
        register_date: this.registerDate
      }
      this.loading = true;
      fetch(`${this.$store.state.apiUrl}/payments-registers`, {
          method: "POST",
          body: JSON.stringify(_data),
          headers: {"Content-type": "application/json; charset=UTF-8"}
      })
      .then(response => response.json())
      .then(json => console.log(json))
      .then(() => this.loadPaymentsRegisters())
      .then(() => this.loadTotal())
      .catch(err => console.log(err))
      .finally(() => this.loading = false);
    },
    removePaymentsRegister(id){
      const indexOfItemToRemove = this.paymentsRegisters.findIndex(x => x.id === id)
      const foundItem = indexOfItemToRemove !== -1 ;
      if (foundItem) {
        this.paymentsRegisters.splice(indexOfItemToRemove, 1);
      }
      this.deletePaymentsRegister(id);
    },
    deletePaymentsRegister(id){
      this.loading = true;
      fetch(`${this.$store.state.apiUrl}/payments-registers/${id}`, {
          method: "DELETE",
          headers: {"Content-type": "application/json; charset=UTF-8"}
      })
      .then(() => this.loadPaymentsRegisters())
      .then(() => this.loadTotal())
      .catch(err => console.log(err))
      .finally(() => this.loading = false);
    }
  },
  components: {
    PaymentsSheetRow
  },
  watch: {
    registerDate() {
      this.loadPaymentsRegisters();
      this.loadTotal();
    },
    storeId() {
      this.loadPaymentsRegisters();
      this.loadTotal();
    }
  }
}
</script>

<style scoped>
#payments {
  height:50vh;
  overflow-y:scroll;
}
</style>
