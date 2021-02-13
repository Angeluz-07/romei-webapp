<template>
    <div>
        <p>Payments XXXXXXXXX</p>
        <table class="table table-bordered table-hover">
            <thead>
                <tr>
                <th scope="col"></th>
                <th scope="col"></th>
                <th scope="col"></th>
                <th scope="col"></th>
                </tr>
            </thead>
            <tbody>
                <PaymentsSheetRow 
                  v-for="paymentsRegister in paymentsRegisters"  
                  :key="paymentsRegister.id" 
                  :paymentsRegister="paymentsRegister" 
                  v-on:removePaymentsRegister="removePaymentsRegister"
                />
      
                <tr>
                <td><input v-model="value"  type="text" class="form-control"></td>
                <td><input v-model="name" type="text" class="form-control"></td>
                <td><input v-model="description"  type="text" class="form-control"></td>
                <td><button type="button" class="btn btn-secondary"  @click="addPaymentsRegister">+</button></td>
                </tr>
              
                <tr>
                <td scope="col"></td>
                <td scope="col"></td>
                <td scope="col"></td>
                <td scope="col"></td> 
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>

import PaymentsSheetRow from './PaymentsSheetRow.vue'

const BASE_URL = 'http://localhost:8000/dailyControl/api';

export default {
  name: 'PaymentsSheet',
  props: ['registerDate','storeId'],
  data() {
    return {
      loading: false,
      paymentsRegisters : [],
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
    }
  },
  methods: {
    loadPaymentsRegisters(){
      const URL = `${BASE_URL}/payments-registers?register_date=${this.registerDate}&store_id=${this.storeId}`;
      fetch(URL)
      .then(response => response.json())
      .then(paymentsRegisters => this.paymentsRegisters = paymentsRegisters)
      .then(()=> console.log(this.paymentsRegisters))
      //.then(() => this.$store.commit('setCashSales', this.salesRegisters))
      //.then(() => console.log(this.$store.state.cashSales))
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
      fetch(`${BASE_URL}/payments-registers`, {
          method: "POST",
          body: JSON.stringify(_data),
          headers: {"Content-type": "application/json; charset=UTF-8"}
      })
      .then(response => response.json())
      .then(json => console.log(json))
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
      fetch(`${BASE_URL}/payments-registers/${id}`, {
          method: "DELETE",
          headers: {"Content-type": "application/json; charset=UTF-8"}
      })
      .then(response => response.json())
      .then(json => console.log(json))
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
    },
    storeId() {
      this.loadPaymentsRegisters();
    }
  }
}
</script>

<style scoped>
</style>
