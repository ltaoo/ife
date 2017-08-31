<template>
    <div>
        <cInput v-model="inputValue" placeholder="请输入用户名" />
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
                inputValue: '',
            };
        },
    };
</script>

<style scoped>
</style>
