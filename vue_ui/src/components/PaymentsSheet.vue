<template>
    <div>
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
                <td style="width:15%"><input v-model="value"  type="text" class="form-control"></td>
                <td style="width:25%" ><input v-model="name" type="text" class="form-control"></td>
                <td><input v-model="description"  type="text" class="form-control"></td>
                <td><button type="button" class="btn btn-secondary"  @click="addPaymentsRegister">+</button></td>
                </tr>
              
                <tr>
                <td></td>
                <td scope="col">{{ this.paymentsValues }}</td>
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
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const BASE_URL = 'http://localhost:8000/dailyControl/api';

const paymentsValuesStore = new Vuex.Store({
  state: {
    paymentsValues: null,
  },
  mutations: {
    setPaymentsValues (state, paymentsRegisters) {
      state.paymentsValues = paymentsRegisters.map((x) => ({
          'paymentsRegisterId': x.id,
          'value': x.value
        })
      );
    },
    updatePaymentsValues (state, payload) {
      const result = state.paymentsValues.find(x => x.paymentsRegisterId === payload.paymentsRegisterId);
      result.value = payload.value;
    }
  },
  getters: {
    paymentsValuesSum: state => {
      return state.paymentsValues ?
      state.paymentsValues
      .map(x => x.value)
      .reduce((a,b)=>a+b, 0) : 0 ;
    }
  }
})


export default {
  name: 'PaymentsSheet',
  store: paymentsValuesStore,
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
    paymentsValues : function (){
      return this.$store.getters.paymentsValuesSum;
    }
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
      .then(() => this.$store.commit('setPaymentsValues', this.paymentsRegisters))
      .then(() => console.log(this.$store.state.paymentsValues))
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
      .then(() => this.loadPaymentsRegisters())
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
      .then(() => this.loadPaymentsRegisters())
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
