<template>
  <div class="container-fluid">
    <div id="searchControlBar">
      <div class="row my-3">
          <label for="staticEmail" class="col-4 col-md-3 col-form-label">Fecha Inicial</label>
          <div class="col-8 col-md-3 mb-3">
            <input type="date" class="form-control" v-model="startDate">
          </div>
          <label for="staticEmail" class="col-4 col-md-3 col-form-label">Fecha Final</label>
          <div class="col-8 col-md-3">
            <input type="date" class="form-control" v-model="endDate">
          </div>
      </div>
      <div class="row my-3">
        <div class="col-4 col-md-3">
          <button type="button" class="btn btn-secondary" v-on:click="search();loadTotal();">
            Search
          </button>
          </div>
          <div class="col-8 col-md-9">
            <input type="text" class="form-control" v-model="searchText">
          </div>
      </div>
    </div>

    <div id="payments" class="mt-4 border-top">
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
              <tr  
                v-for="paymentRegister in paymentRegisters"
                :key="paymentRegister.id">
              <td style="width:5%"></td>
              <td style="width:15%"><input :value="paymentRegister.value" type="text" class="form-control text-right" disabled></td>
              <td><input :value="paymentRegister.description" type="text" class="form-control" disabled></td>
              <td>{{ paymentRegister.register_date }}</td>
              <td>{{ paymentRegister.store_name }}</td>
              </tr>

              <tr>
              <td></td>
              <td scope="col" class="text-right pr-4">{{ this.paymentRegistersValuesTotal }}</td>
              <td scope="col"></td>
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

import axios from 'axios';

axios.defaults.xsrfHeaderName = "X-CSRFToken"
axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.withCredentials = true

export default {
  name: 'App',
  data() {
    return {
      paymentRegisters : [],
      paymentRegistersValuesTotal: null,
      startDate : this.today(),
      endDate : this.today(),
      searchText : '',
    }
  },
  mounted () {
  },
  methods: {
    getDateFormatted(_date){
      var dd = String(_date.getDate()).padStart(2, '0');
      var mm = String(_date.getMonth() + 1).padStart(2, '0'); //January is 0!
      var yyyy = _date.getFullYear();

      return `${yyyy}-${mm}-${dd}`
    },
    today(){
      var today = new Date();
      return this.getDateFormatted(today)
    },
    search(){
      const URL = `${this.$store.state.apiUrl}/payment-registers?register_date.gte=${this.startDate}&register_date.lte=${this.endDate}&description.contains=${this.searchText}`;
      axios.get(URL)
      .then(response => {
        this.paymentRegisters = response.data
      })
      .catch(err => console.log(err.response))
    },
    loadTotal(){
      const URL = `${this.$store.state.apiUrl}/payment-registers/total?register_date.gte=${this.startDate}&register_date.lte=${this.endDate}&description.contains=${this.searchText}`;
      axios.get(URL)
      .then(response => {
        this.paymentRegistersValuesTotal = response.data.value
      })
      .catch(err => console.log(err.response))
    },
  },
  components: {
  },
}
</script>

<style scoped>
#payments {
  height:50vh;
  overflow-y:scroll;
  overflow-x:scroll;
}

table {
  width:800px;
}
</style>
