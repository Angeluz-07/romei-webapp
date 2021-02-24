<template>
  <div class="container-fluid">
    <div id="searchControlBar" class="row my-3">
      <div class="col-sm-6">
        <div class="row">
          <label for="staticEmail" class="col-4 col-form-label">Fecha Inicial</label>
          <div class="col-8">
            <input type="date" class="form-control" v-model="startDate">
          </div>
        </div>
        <div class="row my-3">
          <label for="staticEmail" class="col-4 col-form-label">Buscar</label>
          <div class="col-8">
            <input type="text" class="form-control" v-model="searchText">
          </div>
        </div>
      </div>
      <div class="col-sm-6">
        <div class="row">
          <label for="staticEmail" class="col-4 col-form-label">Fecha Final</label>
          <div class="col-8">
            <input type="date" class="form-control" v-model="endDate">
          </div>
        </div>
        <div class="row my-3">
          <!--label for="staticEmail" class="col-4 col-form-label">Tienda</label-->
          <div class="col-12">
            <button type="button" class="btn btn-secondary" v-on:click="search();loadTotal();">
            Search
            </button>
          </div>
        </div>
      </div>
    </div>

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
              <tr  
                v-for="paymentsRegister in paymentsRegisters"
                :key="paymentsRegister.id">
              <td style="width:5%"></td>
              <td style="width:15%"><input :value="paymentsRegister.value" type="text" class="form-control text-right" disabled></td>
              <td style="width:25%" ><input :value="paymentsRegister.name" type="text" class="form-control" disabled></td>
              <td><input :value="paymentsRegister.description" type="text" class="form-control" disabled></td>
              <td>{{ paymentsRegister.register_date }}</td>
              <td>{{ paymentsRegister.store_name }}</td>
              </tr>

              <tr>
              <td></td>
              <td scope="col" class="text-right pr-4">{{ this.paymentsRegistersValuesTotal }}</td>
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
      paymentsRegisters : [],
      paymentsRegistersValuesTotal: null,
      startDate : this.today(),
      endDate : this.today(),
      searchText : '',
      storeId: null
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
    yesterday(){
      const today = new Date()
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)
      return this.getDateFormatted(yesterday)
    },
    search(){
      const URL = `${this.$store.state.apiUrl}/payments-registers?register_date.gte=${this.startDate}&register_date.lte=${this.endDate}&name.contains=${this.searchText}&description.contains=${this.searchText}`;
      axios.get(URL)
      .then(response => {
        console.log('search payments',response)
        this.paymentsRegisters = response.data
      })
      .catch(err => console.log(err.response))
    },
    loadTotal(){
      const URL = `${this.$store.state.apiUrl}/payments-registers/total?register_date.gte=${this.startDate}&register_date.lte=${this.endDate}&name.contains=${this.searchText}&description.contains=${this.searchText}`;
      axios.get(URL)
      .then(response => {
        console.log('payments registers total',response)
        this.paymentsRegistersValuesTotal = response.data.value
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
}
</style>
