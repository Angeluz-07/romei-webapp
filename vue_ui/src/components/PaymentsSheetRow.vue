<template>
    <tr>
        <td><div v-if="loading" class="spinner-border spinner-border-sm text-secondary" role="status"></div></td>
        <td><input v-model="value" v-on:input="waitForInputWrapper(1)" type="text" class="form-control"></td>
        <td><input v-model="name" v-on:input="waitForInputWrapper(2)" type="text" class="form-control"></td>
        <td><input v-model="description"  v-on:input="waitForInputWrapper(3)" type="text" class="form-control"></td>
        <td>
        <button type="button" class="btn btn-danger" @click="$emit('removePaymentsRegister', paymentsRegister.id)">x</button>
        </td>
    </tr>
</template>

<script>

const BASE_URL = 'http://localhost:8000/dailyControl/api';

export default {
    name: 'PaymentsSheetRow',
    props: ['paymentsRegister'],
    data() {
        return {
            waitForTyping:false,
            loading : false,
            value : "",
            name: "",
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
            this.name = this.paymentsRegister.name;
            this.description = this.paymentsRegister.description;
        },
        updatePaymentsRegister() {
            let _value = this.value ? Number(this.value) : 0 ;
            let _data = {
                value : _value,
                name : this.name,
                description : this.description
            }
            this.loading = true;
            fetch(`${BASE_URL}/payments-registers/${this.paymentsRegister.id}`, {
                method: "PATCH",
                body: JSON.stringify(_data),
                headers: {"Content-type": "application/json; charset=UTF-8"}
            })
            .then(response => response.json())
            .then(json => console.log(json))
            .then(()=> this.$emit('reloadTotal'))
            .catch(err => console.log(err))
            .finally(() => this.loading = false);
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
