// 全体数据 - 大区分析 页面的表格
export const regionTableColumn = [
    {
        title: '区域',
        key: 'region',
    }, {
        title: '新签业绩',
        key: 'new',
    }, {
        title: '尾款业绩',
        key: 'last',
    }, {
        title: '续约业绩',
        key: 'continue',
    }, {
        title: '增值业绩',
        key: 'add',
    }, {
        title: '广告业绩',
        key: 'ad',
    }, {
        title: '合计',
        key: 'total',
    }, {
        title: '拜访量均值',
        key: 'visit',
    }, {
        title: '沟通记录均值',
        key: 'chat',
    }, {
        title: '进行中的商家(A)',
        key: 'activing',
    }, {
        title: '进行中的商家(B)',
        key: 'activing',
    }, {
        title: '净利润',
        key: 'money',
    },
];
// 全体数据 - 团队分析 页面的表格
export const teamTableColumn = [
    {
        title: '区域',
        key: 'region',
    }, {
        title: '二级区域',
        key: 'region',
    }, {
        title: '团队',
        key: 'team',
    }, {
        title: '指标',
        key: 'target',
    }, {
        title: '新签业绩',
        key: 'new',
    }, {
        title: '尾款业绩',
        key: 'last',
    }, {
        title: '完成率',
        key: 'achieve',
    }, {
        title: '进行中的商家(A)',
        key: 'active',
    }, {
        title: '进行中的商家(B)',
        key: 'active',
    },
];
// 员工数据页面的表格
export const employeeTableColumn = [
    {
        title: '月份',
        key: 'name',
    }, {
        title: '一级部门',
        key: 'age',
    }, {
        title: '二级部门',
        key: 'address',
    }, {
        title: '三级部门',
        key: 'address',
    }, {
        title: '员工姓名',
        key: 'address',
    }, {
        title: '员工分类',
        key: 'address',
    }, {
        title: '指标',
        key: 'address',
    }, {
        title: '新签业绩',
        key: 'address',
    }, {
        title: '尾款业绩',
        key: 'address',
    }, {
        title: '完成率排名',
        key: 'address',
    }, {
        title: '拜访量',
        key: 'address',
    }, {
        title: '沟通记录数',
        key: 'address',
    }, {
        title: '进行中的商家',
        key: 'address',
    },
];
// 行业数据页面的表格头
export const industryTableColumn = [
    {
        title: '区域',
        key: 'name',
    }, {
        title: '新签业绩',
        key: 'age',
    }, {
        title: '尾款业绩',
        key: 'address',
    }, {
        title: '续约业绩',
        key: 'address',
    }, {
        title: '增值业绩',
        key: 'address',
    }, {
        title: '广告业绩',
        key: 'address',
    }, {
        title: '合计',
        key: 'address',
    }, {
        title: '拜访量均值',
        key: 'address',
    }, {
        title: '沟通记录均值',
        key: 'address',
    }, {
        title: '进行中的上级',
        key: 'address',
    }, {
        title: '净利润',
        key: 'address',
    },
];
// 管理 - 指标管理 tab 内的表格
export const targetTableColumn = [
    {
        title: '部门',
        key: 'region',
    },
    {
        title: '1月',
        key: 'january',
    },
    {
        title: '2月',
        key: 'february',
    },
    {
        title: '3月',
        key: 'march',
    },
    {
        title: '4月',
        key: 'april',
    },
    {
        title: '5月',
        key: 'may',
    },
    {
        title: '6月',
        key: 'june',
    },
    {
        title: '7月',
        key: 'july',
    },
    {
        title: '8月',
        key: 'august',
    },
    {
        title: '9月',
        key: 'september',
    },
    {
        title: '10月',
        key: 'october',
    },
    {
        title: '11月',
        key: 'november',
    },
    {
        title: '12月',
        key: 'december',
    },
];

export const rankTableColumn = [
    {
        title: '部门',
        key: 'region',
    },
    {
        title: '员工分类',
        key: 'name',
        render(h) {
            return h('div', [
                h('Select', [
                    h('Option', {
                        props: {
                            value: '新人',
                            key: 0,
                        },
                    }),
                ], {
                    type: 'select',
                }),
            ]);
        },
    },
    {
        title: '员工等级',
        key: 'age',
        render(h) {
            return h('div', [
                h('Select'),
            ]);
        },
    },
    {
        title: '时间区间',
        key: 'address',
        render(h) {
            return h('div', [
                h('DatePicker', {
                    props: {
                        type: 'date',
                        placeholder: '选择日期',
                    },
                })],
            );
        },
    },
    {
        title: '限定金额',
        key: 'address',
        render(h) {
            return h('div', [
                h('Input'),
            ]);
        },
    },
];
