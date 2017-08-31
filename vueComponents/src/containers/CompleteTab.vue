<template>
    <div>
        <h3>新人</h3>
        <Form :model="formItem" :label-width="80" inline>
            <FormItem label="新签业绩 *">
                <Input />
            </FormItem>
            <FormItem label="+ 尾款业绩 *">
                <Input />
            </FormItem>
            <FormItem label="+ 广告业绩 *">
                <Input />
            </FormItem>
            <FormItem label="+ 增值业绩*">
                <Input />
            </FormItem>
        </Form>

        <Form :model="formItem" :label-width="80" inline>
            <FormItem label="第1月">
                <Input />
            </FormItem>
            <FormItem label="第2月">
                <Input />
            </FormItem>
            <FormItem label="第3月">
                <Input />
            </FormItem>
            <FormItem label="第4月">
                <Input />
            </FormItem>
        </Form>
        <h3>SMB</h3>
        <Form :model="formItem" :label-width="80" inline>
            <FormItem label="新签业绩 *">
                <Input />
            </FormItem>
            <FormItem label="+ 尾款业绩 *">
                <Input />
            </FormItem>
            <FormItem label="+ 广告业绩 *">
                <Input />
            </FormItem>
            <FormItem label="+ 增值业绩*">
                <Input />
            </FormItem>
        </Form>
        <Form :model="formItem" :label-width="80" inline>
            <FormItem label="L3">
                <Input />
            </FormItem>
            <FormItem label="L4">
                <Input />
            </FormItem>
            <FormItem label="L5">
                <Input />
            </FormItem>
            <FormItem label="L6">
                <Input />
            </FormItem>
        </Form>

        <h3>AM</h3>
        <Form :model="formItem" :label-width="80" inline>
            <FormItem label="新签业绩 *">
                <Input />
            </FormItem>
            <FormItem label="+ 尾款业绩 *">
                <Input />
            </FormItem>
            <FormItem label="+ 广告业绩 *">
                <Input />
            </FormItem>
            <FormItem label="+ 增值业绩*">
                <Input />
            </FormItem>
        </Form>
        <Form :model="formItem" :label-width="80" inline>
            <FormItem label="AM">
                <Input />
            </FormItem>
        </Form>
        <Button type="primary">提交</Button>
    </div>
</template>

<script>
    export default {
        name: 'complete-per-tab',
    };
</script>

<style>

</style>

