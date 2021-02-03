<template>
    <tr>   
        <td><input v-model="productStockRaw"  type="text" class="form-control"></td>

        <td><input v-model="stockAdditionRaw" type="text" class="form-control"></td>
        <td>{{ product.name }}</td>    
        <td>{{ this.formatStock(product.stock) }}</td>

        <td>{{ this.PARSE_NUMBER_TO_DOZEN(this.initialStock) }}</td>
        <td><input v-model="finalStockRaw" type="text" class="form-control"></td>
        <td>{{ this.PARSE_NUMBER_TO_DOZEN(this.soldQuantity) }}</td> 
        <td>{{ this.cashSale }}</td>
        <td>{{ this.productSalePrice }}</td>
        <!--td>{{ this.PARSE_NUMBER_TO_DOZEN(this.register.productStock) }}</td>
        <td><input v-model="stockAdditionRaw" v-on:input="updateInitialStock" type="text" class="form-control"></td>        
        <td><input v-model="finalStockRaw" v-on:input="updateSaleInfo" type="text" class="form-control"></td>
        -->
    </tr>
</template>

<script>
export default {
  name: 'SheetRow',
  props: ['product'],
  data() {
    return {
        productStockRaw : "",     
        finalStockRaw : "",

        stockAdditionRaw : "",   
    }
  },
  computed:{
      initialStock : function (){
        return this.productStock + this.stockAddition;
      },
      soldQuantity : function (){
        return this.initialStock - this.finalStock;
      },
      stockAddition : function() {
        return this.PARSE_DOZEN_TO_NUMBER(this.stockAdditionRaw)
      },
      productStock : function(){
          return this.PARSE_DOZEN_TO_NUMBER(this.productStockRaw)
      },
      finalStock : function() {
          return this.PARSE_DOZEN_TO_NUMBER(this.finalStockRaw)
      },
      cashSale : function(){
          return this.soldQuantity * this.productSalePrice
      },
      productSalePrice : function(){
          return this.product.salePrice
      }
  },
  mounted(){
        if(!this.hasRegisterAtDate() && this.hasLastRegister()){
            const register = this.product.lastRegisters.lastRegister[0]
            this.productStockRaw = this.PARSE_NUMBER_TO_DOZEN(register.productStock)
            this.stockAdditionRaw = this.PARSE_NUMBER_TO_DOZEN(register.stockAddition)
            this.finalStockRaw = this.PARSE_NUMBER_TO_DOZEN(register.finalStock)
        }
  },
  methods: {
    hasRegisterAtDate(){
        return this.product.registersAtDate.registerAtDate.length > 0
    },
    hasLastRegister(){
        return this.product.lastRegisters.lastRegister.length > 0
    },
    updateSaleInfo() {
        this.updateSoldQuantity();
        this.updateCashSale();
        this.$emit("updateCashSales", {
            'cashSale': this.cashSale ,
            'productId' : this.product.id
        });
    },
    formatStock(value) {
        return this.PARSE_NUMBER_TO_DOZEN(value);
    },
    PARSE_DOZEN_TO_NUMBER(dozens){
        let dozenPart,unitsPart;
        // #D# -> adb ; #D -> ad ; # -> b
        let a,b; 
        let l=dozens.split("D");
        let k=1;
        switch(k){
            //#d# -> adb
            case 1:
            if (dozens===''){
                return 0;
            }
            if (!dozens.includes('D')) {        
                return parseInt(l[0],10);
            }
            a=parseInt(l[0],10);      
            if (dozens.substr(-1) === 'D'){
                b = 0;
            }else{
                b=parseInt(l[1],10);
            }
            dozenPart=a*12;
            unitsPart=b;      
            if (dozenPart < 0) {
                return -(Math.abs(dozenPart) + unitsPart);
            }else {
                return (dozenPart+unitsPart);
            }
            //#d -> ad   
            case 2:
            a=parseInt(l[0],10);
            dozenPart=a*12;
            unitsPart=0;      
            if (dozenPart < 0) {
                return -(Math.abs(dozenPart) + unitsPart);
            }else {
                return (dozenPart+unitsPart);
            }
            /*
            //# -> 0<=b<12 -> case 3
            //# -> 0<=b -> case 4
            case 3:case 4:
            b=parseInt(l[0],10);
            dozenPart=0;
            unitsPart=b;      
            return (dozenPart+unitsPart); 				  
            default:
            return "error_";//to internal maintenance
            */
        }
    },
    PARSE_NUMBER_TO_DOZEN(n){
        if(n<12&&n>=0){
            return n+'';
        }
        //if passes, at least has 1 dozen
        let dozenPart=Math.trunc(n/12);
        let unitsPart=n%12;
        if(0==unitsPart){
            return dozenPart+'D';
        }else{
            return dozenPart+'D'+unitsPart;
        }
    }
  }
}
</script>

<style scoped>
</style>
