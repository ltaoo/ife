<template>
    <div>
        <cInput v-model="inputValue" />
        <p>{{inputValue}}</p>
    </div>
</template>

<script>
    import '@/assets/reset.css';
    import '@/assets/common.css';

    import cInput from '@/components/Input';

    export default {
        name: 'app',
        components: {
            cInput,
        },
        data() {
            return {
                inputValue: 'hello world',
            };
        },
    };
</script>

<style scoped>
</style>
