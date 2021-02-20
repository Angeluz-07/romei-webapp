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
            <!--select class="form-control" v-model="storeId">
              <option v-for="store in stores" :key="store.id" :value="store.id">{{store.name}}</option>
            </select-->
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

export default {
  name: 'App',
  data() {
    return {
      stores : [],
      paymentsRegisters : [],
      paymentsRegistersValuesTotal: null,
      startDate : this.today(),
      endDate : this.today(),
      searchText : '',
      storeId: null
    }
  },
  mounted () {
    this.loadStores();
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
      fetch(URL)
      .then(response => response.json())
      .then(items => {
        this.paymentsRegisters = items;
      })
      .then(() => console.log(this.paymentsRegisters))
    },
    loadTotal(){
      const URL = `${this.$store.state.apiUrl}/payments-registers/total?register_date.gte=${this.startDate}&register_date.lte=${this.endDate}&name.contains=${this.searchText}&description.contains=${this.searchText}`;
      fetch(URL)
      .then(response => response.json())
      .then(responseJson => this.paymentsRegistersValuesTotal = responseJson.value)
      .then(()=> console.log(this.paymentsRegistersValuesTotal))
    },
    loadStores(){
      const URL = `${this.$store.state.apiUrl}/stores`;
      fetch(URL)
      .then(response => response.json())
      .then(stores => {
        this.stores = stores
        let firstOption = stores[0].id;
        this.storeId = firstOption;
      })
      .then(() => console.log(this.stores))
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
