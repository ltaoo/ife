<template>
    <Row>
        <Col :span="4">
            <Tree :data="departmentTree"></Tree>
        </Col>
        <Col :span="20">
            <Table :columns="targetTableColumn" :data="data"></Table>
        </Col>
    </Row>
</template>

<script>
    // 指标管理 tab 里面的表格头、等级管理 tab 里面的表格头
    import { targetTableColumn } from '@/constants';

    // 部门层级树
    const departmentTree = [{
        expand: true,
        title: '华东区',
        children: [{
            title: '华东区 - 战狼队',
            expand: true,
            children: [{
                title: '沐沐',
            }, {
                title: '无涯',
            }],
        }, {
            title: '大中区',
            expand: true,
            children: [{
                title: '王者队',
            }],
        }],
    }];

    export default {
        name: 'target-management-tab',
        data() {
            return {
                departmentTree,
                targetTableColumn,
                data: [
                    {
                        region: '华东区',
                        name: 'hello',
                        age: 18,
                        address: '北京市朝阳区芍药居',
                    },
                ],
            };
        },
    };
</script>

<style>

</style>

