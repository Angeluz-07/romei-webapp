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
        hello
      </div>
    </div>
  </div>
</template>

<script>

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

<style>
</style>
