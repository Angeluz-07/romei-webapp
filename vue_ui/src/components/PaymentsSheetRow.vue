<template>
    <tr>
        <td><input v-model="value" v-on:input="updatePaymentsRegister();updatePaymentsValues()" type="text" class="form-control"></td>
        <td><input v-model="name" v-on:input="updatePaymentsRegister();updatePaymentsValues()" type="text" class="form-control"></td>
        <td><input v-model="description"  v-on:input="updatePaymentsRegister();updatePaymentsValues()" type="text" class="form-control"></td>
        <td>
        <div v-if="loading" class="spinner-border text-secondary" role="status"></div>
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
        updatePaymentsValues() {
            let _value = this.value ? Number(this.value) : 0 ;
            this.$store.commit('updatePaymentsValues', {
                paymentsRegisterId : this.paymentsRegister.id,
                value : _value
            });
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
            .catch(err => console.log(err))
            .finally(() => this.loading = false);
        },
    }
}
</script>

<style scoped>
</style>
