<template>
    <div>
        <p>Puesto x</p>
        <table class="table table-bordered table-hover">
            <thead>
                <tr>
                <th scope="col"></th>
                <th scope="col"></th>
                <th scope="col"></th>                
                <th scope="col"></th>
                <th scope="col"></th>
                <th scope="col"></th> 
                <th scope="col"></th>                              
                <th scope="col"></th>
                </tr>
            </thead>
            <tbody>                
                <SheetRow  v-on:updateCashSales="updateCashSales"/>
                <tr>
                <td scope="col"></td>
                <td scope="col"></td>
                <td scope="col"></td>                
                <td scope="col"></td>
                <td scope="col"></td>
                <td scope="col"></td>                                
                <td scope="col">{{ cashSales }}</td>
                <td scope="col"></td>              
                </tr>
            </tbody>
        </table>
        <button type="button" class="btn btn-secondary" @click="saveData">Guardar</button>
    </div>
</template>

<script>

import SheetRow from './SheetRow.vue'

export default {
  name: 'Sheet',
  //props: ['products'], 
  data() {
    return {
      cashSaleList:[], 
      products :[
        { id : 1,
          name: 'product1',
          stock : 40,
        },
        {
          id: 2,
          name :'product2',
          stock: 50 
        },
        {
          id : 3,
          name : 'product3',
          stock : 34
        }
      ]
    }
  },
  computed: {
    cashSales : function (){
      return this.cashSaleList.map(x => x.cashSale).reduce((a,b)=>a+b, 0)
    }
  },
  methods: {
    updateCashSales(data){
      let product = this.cashSaleList.find(x => x.productId === data.productId);
      product.cashSale = data.cashSale;
    },
    createCashSaleList(){
      this.cashSaleList = this.products.map( function(x){
        return {
          'productId': x.id,
          'cashSale': 0 
        }
      });
    },
    saveData(){
      console.log("hello");
      console.log(this.products)
      
      console.log(this.cashSaleList)
    }
  },
  mounted() {
    this.createCashSaleList();
  },
  components: {
    SheetRow
  }
}
</script>

<style scoped>
</style>
