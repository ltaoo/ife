<template>
    <div class="c-input">
        <input
            ref="input"
            class="c-input__input" 
            :value="value" 
            v-on:input="updateValue" 
            v-on:focus="inputFocus" 
            v-on:blur="inputBlur"
        />
        <span ref="placeholder" class="c-input__placeholder" v-on:click="inputFocus">{{placeholder}}</span>
    </div>
</template>

<script>
    export default {
        name: 'input',
        props: ['value', 'placeholder'],
        methods: {
            updateValue(e) {
                const value = e.target.value;
                this.$emit('input', value);
            },
            inputFocus() {
                const container = document.querySelector('.c-input');
                const placeholder = this.$refs.placeholder;
                const input = this.$refs.input;
                input.focus();
                container.className = 'c-input c-input--border-green';
                placeholder.className = 'c-input__placeholder c-input__placeholder--top';
            },
            inputBlur() {
                const container = document.querySelector('.c-input');
                const placeholder = this.$refs.placeholder;
                container.className = 'c-input';
                if (!this.value || !this.value.trim()) {
                    placeholder.className = 'c-input__placeholder';
                }
            },
        },
    };
</script>

<style type="text/css" scoped>
    .c-input {
        position: relative;
        display: inline-block;
        margin: 50px;
        border: 1px solid #ccc;
        border-radius: 20px;
    }
    .c-input--border-green {
        border-color: green;
    }
    .c-input__input {
        padding: 5px 10px;
        border: 0;
        border-radius: 20px;
        font-size: 16px;
        outline: none;
    }
    .c-input__placeholder {
        position: absolute;
        top: 4px;
        left: 10px;
        font-size: 14px;
        color: #ccc;
        transition: all .2s;
    }
    .c-input__placeholder--top {
        top: -20px;
        left: 8px;
        font-size: 12px;
        color: #ccc;
    }
</style>