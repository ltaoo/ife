<template>
    <input v-bind:value="value" v-on:input="updateValue" />
</template>

<script>
    export default {
        name: 'input',
        props: ['value'],
        methods: {
            updateValue(e) {
                const value = e.target.value;
                this.$emit('input', value);
            },
        },
    };
</script>

<style type="text/css">
</style>