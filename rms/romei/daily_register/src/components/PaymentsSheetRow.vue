<template>
    <tr>
        <td><div v-if="loading" class="spinner-border spinner-border-sm text-secondary" role="status"></div></td>
        <td class="px-2">
            <input 
                v-model="value" 
                v-on:input="waitForInputWrapper(1)" 
                type="text" 
                class="form-control text-right px-1">
        </td>
        <td>
            <textarea 
                v-model="description"  
                v-on:input="waitForInputWrapper(3)" 
                type="text" 
                class="form-control"
                oninput='this.style.height = "";this.style.height = this.scrollHeight + 3 + "px"'>
            </textarea>
        <td>
        <button 
            type="button" 
            class="btn btn-danger" 
            @click="$emit('removePaymentsRegister', paymentsRegister.id, paymentsRegister.value, paymentsRegister.description)"
        >
            X
        </button>
        </td>
    </tr>
</template>

<script>

export default {
    name: 'PaymentsSheetRow',
    props: ['paymentsRegister'],
    data() {
        return {
            waitForTyping:false,
            loading : false,
            value : "",
            description: ""
        }
    },
    computed:{
    },
    mounted(){
        this.setDefaultValues();
    },
    methods: {
        setDefaultValues(){
            this.value = this.paymentsRegister.value;
            this.description = this.paymentsRegister.description;
        },
        updatePaymentsRegister() {
            let _value = this.value ? Number(this.value) : 0 ;
            let payload = {
                data : {
                    value : _value,
                    description : this.description
                },
                id : this.paymentsRegister.id
            }
            this.loading = true;
            this.$store
            .dispatch('updatePaymentRegister', payload)
            .then(() => this.loading = false)
            .then(() => this.$store.dispatch('loadPaymentTotal'));
        },
        waitForInputWrapper(seconds){
            if (!this.waitForTyping) {
                setTimeout(() => {
                    this.updatePaymentsRegister();
                    this.waitForTyping= false;
                }, seconds*1000);
            }
            this.waitForTyping = true;
        }
    }
}
</script>

<style scoped>
</style>
