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
            <a class="nav-link active" id="nav-home-tab" data-toggle="tab" href="#nav-sale-registers" role="tab" aria-controls="nav-home" aria-selected="true">Ventas</a>
            <a class="nav-link" id="nav-profile-tab" data-toggle="tab" href="#nav-payment-registers" role="tab" aria-controls="nav-profile" aria-selected="false">Apuntes</a>
            <a class="nav-link" id="nav-profile-tab" data-toggle="tab" href="#nav-sales-payments-diff" role="tab" aria-controls="nav-profile" aria-selected="false">Cuadre</a>
          </div>
        </nav>
        <div class="tab-content my-3" id="nav-tabContent">
          <div class="tab-pane fade show active" id="nav-sale-registers" role="tabpanel" aria-labelledby="nav-home-tab">
            <SalesSheet />
          </div>
          <div class="tab-pane fade" id="nav-payment-registers" role="tabpanel" aria-labelledby="nav-profile-tab">
            <PaymentsSheet :storeId="storeId" :registerDate="registerDate"/>
          </div>
          <div class="tab-pane fade" id="nav-sales-payments-diff" role="tabpanel" aria-labelledby="nav-profile-tab">
            <SalesPaymentsDiff />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SalesSheet  from './SalesSheet.vue'
import PaymentsSheet from './PaymentsSheet.vue'
import SalesPaymentsDiff from './SalesPaymentsDiff.vue'
import { mapActions } from 'vuex'

export default {
  name: 'App',
  data() {
    return {
      registerDate : this.today(),
      storeId: -1
    }
  },
  computed: {
    stores: function(){
      return  this.$store.state.stores
    }
  },
  mounted () {
    this.loadStores();
    this.loadTotalSales({
      registerDate: this.registerDate,
      storeId: this.storeId
    });
    this.loadSalesRegisters({
      registerDate: this.registerDate,
      storeId: this.storeId
    }),
    this.loadPaymentsRegisters({
      registerDate: this.registerDate,
      storeId: this.storeId
    }),
    this.loadTotalPayments({
      registerDate: this.registerDate,
      storeId: this.storeId
    });
  },
  methods: {
    ...mapActions([
      'loadStores',
      'loadTotalSales',
      'loadSalesRegisters',
      'loadPaymentsRegisters',
      'loadTotalPayments'
    ]),
    today(){
      var today = new Date();
      var dd = String(today.getDate()).padStart(2, '0');
      var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
      var yyyy = today.getFullYear();

      return `${yyyy}-${mm}-${dd}`
    },
  },
  watch:{
    registerDate() {
      this.loadTotalSales({
        registerDate: this.registerDate,
        storeId: this.storeId
      });
      this.loadSalesRegisters({
        registerDate: this.registerDate,
        storeId: this.storeId
      });
      this.loadPaymentsRegisters({
        registerDate: this.registerDate,
        storeId: this.storeId
      })
      this.loadTotalPayments({
        registerDate: this.registerDate,
        storeId: this.storeId
      });
    },
    storeId(){
      this.loadTotalSales({
        registerDate: this.registerDate,
        storeId: this.storeId
      });
      this.loadSalesRegisters({
        registerDate: this.registerDate,
        storeId: this.storeId
      });  
      this.loadPaymentsRegisters({
        registerDate: this.registerDate,
        storeId: this.storeId
      })
      this.loadTotalPayments({
        registerDate: this.registerDate,
        storeId: this.storeId
      });
    }
  },
  components: {
    SalesSheet,
    PaymentsSheet,
    SalesPaymentsDiff
  },
}
</script>

<style>
</style>
