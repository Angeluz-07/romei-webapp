<template>
    <tr>
        <td style="width:5%"><div v-if="loading" class="spinner-border spinner-border-sm text-secondary" role="status"></div></td>
        <td style="width:10%"><input v-model="stockAdditionInput" v-on:input="waitForInputWrapper(2);" type="text" class="form-control"></td>
        <td style="width:10%">{{ this.formatStock(this.salesRegister.product_stock) }}</td>
        <td style="width:20%">{{ this.salesRegister.product_name }}</td>
        <td style="width:10%">{{ this.formatStock(initialStock) }}</td>
        <td style="width:10%"><input v-model="finalStockInput" v-on:input="updateCashSale();waitForInputWrapper(2);" type="text" class="form-control"></td>
        <td style="width:10%">{{ this.formatStock(stockSold) }}</td>
        <td style="width:10%">{{ this.salesRegister.product_price }}</td>
        <td style="width:10%">{{ this.cashSale }}</td>
    </tr>
</template>

<script>

const BASE_URL = 'http://localhost:8000/dailyControl/api';

export default {
    name: 'SalesSheetRow',
    props: ['salesRegister'],
    data() {
        return {
            stockAdditionInput: "",
            finalStockInput : "",
            loading: false,
            waitForTyping: false,
        }
    },
    computed:{
        stockAddition : function() {
            return this.PARSE_DOZEN_TO_NUMBER(this.stockAdditionInput)
        },
        initialStock : function () {
            return this.salesRegister.product_stock + this.stockAddition;
        },
        finalStock : function () {
            return this.PARSE_DOZEN_TO_NUMBER(this.finalStockInput)
        },
        stockSold : function () {
            return Math.abs(this.finalStock - this.initialStock);
        },
        cashSale : function(){
            return this.stockSold * this.salesRegister.product_price;
        },
    },
    mounted(){
        this.setDefaultValues();
    },
    methods: {
        updateCashSale() {
            this.$store.commit('updateCashSale', {
                salesRegisterId : this.salesRegister.id,
                cashSale : this.cashSale
            });
        },
        updateSalesRegister() {
            let _data = {
                final_stock: this.finalStock,
                stock_addition : this.stockAddition
            }
            this.loading = true;
            fetch(`${BASE_URL}/sales-registers/${this.salesRegister.id}`, {
                method: "PATCH",
                body: JSON.stringify(_data),
                headers: {"Content-type": "application/json; charset=UTF-8"}
            })
            .then(response => response.json())
            .then(json => console.log(json))
            .catch(err => console.log(err))
            .finally(() => this.loading = false);
        },
        formatStock(value) {
            return this.PARSE_NUMBER_TO_DOZEN(value);
        },
        setDefaultValues(){
            this.finalStockInput = this.PARSE_NUMBER_TO_DOZEN(this.salesRegister.final_stock);
            this.stockAdditionInput =this.PARSE_NUMBER_TO_DOZEN(this.salesRegister.stock_addition);
        },
        waitForInputWrapper(seconds){
            if (!this.waitForTyping) {
                setTimeout(() => {
                    this.updateSalesRegister();
                    this.waitForTyping= false;
                }, seconds*1000);
            }
            this.waitForTyping = true;
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
