<template>
    <tr>
        <td><input v-model="value"  type="text" class="form-control"></td>
        <td><input v-model="name" type="text" class="form-control"></td>
        <td><input v-model="description"  type="text" class="form-control"></td>
        <td>
        <button type="button" class="btn btn-danger" @click="$emit('removePaymentsRegister', paymentsRegister.id)">x</button>
        </td>
    </tr>
</template>

<script>

//const BASE_URL = 'http://localhost:8000/dailyControl/api';

export default {
    name: 'PaymentsSheetRow',
    props: ['paymentsRegister'],
    data() {
        return {
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
    }
}
</script>

<style scoped>
</style>
