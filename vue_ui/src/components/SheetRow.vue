<template>
    <tr>
        <td><input v-model="stockAdditionInput" type="text" class="form-control"></td>
        <td>{{ this.formatStock(this.product.stock) }}</td>
        <td>{{ this.product.name }}</td>
        <td>{{ this.formatStock(initialStock) }}</td>
        <td><input v-model="finalStockInput" v-on:input="updateCashSale"  type="text" class="form-control"></td>
        <td>{{ this.formatStock(stockSold) }}</td>
        <td>{{ this.product.price }}</td>
        <td>{{ this.cashSale }}</td>
    </tr>
</template>

<script>
export default {
    name: 'SheetRow',
    props: ['product'],
    data() {
        return {
            stockAdditionInput: "",
            finalStockInput : "",
        }
    },
    computed:{
        stockAddition : function() {
            return this.PARSE_DOZEN_TO_NUMBER(this.stockAdditionInput)
        },
        initialStock : function () {
            return this.product.stock + this.stockAddition;
        },
        finalStock : function () {
            return this.PARSE_DOZEN_TO_NUMBER(this.finalStockInput)
        },
        stockSold : function () {
            return Math.abs(this.finalStock - this.initialStock);
        },
        cashSale : function(){
            return this.stockSold * this.product.price;
        },
    },
    mounted(){
        this.setDefaultFinalStock();
    },
    methods: {
        updateCashSale() {
            this.$store.commit('updateCashSale', {
                productId : this.product.id,
                cashSale : this.cashSale
            });
        },
        formatStock(value) {
            return this.PARSE_NUMBER_TO_DOZEN(value);
        },
        setDefaultFinalStock(){
            this.finalStockInput = this.PARSE_NUMBER_TO_DOZEN(this.initialStock);
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
