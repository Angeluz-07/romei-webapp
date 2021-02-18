<template>
  <div class="container-fluid">
    <div class="row my-3">
      <div class="col-8">
        <input type="date" class="form-control" v-model="registerDate">
      </div>
      <div class="col-4">
        <select class="form-control" v-model="storeId">
          <option v-for="store in stores" :key="store.id" :value="store.id">{{store.name}}</option>
        </select>
      </div>
    </div>
    <div class="row my-3">
      <div class="col-12">
        <nav>
          <div class="nav nav-tabs" id="nav-tab" role="tablist">
            <a class="nav-link active" id="nav-home-tab" data-toggle="tab" href="#nav-sales-registers" role="tab" aria-controls="nav-home" aria-selected="true">Mercaderia</a>
            <a class="nav-link" id="nav-profile-tab" data-toggle="tab" href="#nav-payments-registers" role="tab" aria-controls="nav-profile" aria-selected="false">Apuntes</a>
          </div>
        </nav>
        <div class="tab-content my-3" id="nav-tabContent">
          <div class="tab-pane fade show active" id="nav-sales-registers" role="tabpanel" aria-labelledby="nav-home-tab">
            <SalesSheet :registerDate="this.registerDate" :storeId="this.storeId"/>
          </div>
          <div class="tab-pane fade" id="nav-payments-registers" role="tabpanel" aria-labelledby="nav-profile-tab">
            <PaymentsSheet :registerDate="this.registerDate" :storeId="this.storeId" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SalesSheet  from './SalesSheet.vue'
import PaymentsSheet from './PaymentsSheet.vue'

export default {
  name: 'App',
  data() {
    return {
      stores : [],
      registerDate : this.today(),
      storeId: null
    }
  },
  mounted () {
    this.loadStores();
  },
  methods: {
    today(){
      var today = new Date();
      var dd = String(today.getDate()).padStart(2, '0');
      var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
      var yyyy = today.getFullYear();

      return `${yyyy}-${mm}-${dd}`
    },
    loadStores(){
      const URL = `${this.$store.state.apiUrl}/stores`;
      fetch(URL)
      .then(response => response.json())
      .then(stores => this.stores = stores)
      .then(() => console.log(this.stores))
    },
  },
  components: {
    SalesSheet,
    PaymentsSheet
  },
}
</script>

<style>
</style>
