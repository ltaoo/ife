function barInit () {
    /* 从全部记录中提取每个城市的一条数据
     * @return <Array>
     */
    function getData(obj) {
        const categories = []
        const legend = []
        const values = []
        for(let city in obj) {
            // 说明
            categories.push(city)
            values.push(obj[city][0].value)
        }

        return {
            categories,
            values
        }
    }

    const barChart = echarts.init(document.getElementById('bar'))
    barChart.showLoading()

    // 加载空气质量
    $.get('./aqi/data.json', function (data) {
        barChart.hideLoading()

        const { values, categories } = getData(data)
        const option = {
            title: {
                text: '空气质量柱状图'
            },
            tooltip: {
                trigger: 'item',
                formatter: function (params) {
                    return params.name + ' : ' + params.value
                }
            },
            xAxis: {
                type: 'category',
                // x 轴显示时间
                data: categories,
                scale: true,
                boundaryGap : false,
                axisLine: {
                    onZero: false
                },
                splitLine: {
                    show: false
                },
                splitNumber: 20,
                min: 'dataMin',
                max: 'dataMax'
            },
            yAxis: {
                scale: true,
                splitArea: {
                    show: true
                }
            },
            // 缩放
            dataZoom: [
                {
                    type: 'inside',
                    start: 50,
                    end: 100
                },
                {
                    show: true,
                    type: 'slider',
                    y: '90%',
                    start: 50,
                    end: 100
                }
            ],
            series: [{
                name: '空气质量',
                type: 'bar',
                data: values,
                markPoint : {
                    data : [
                        {type : 'max', name: '最大值'},
                        {type : 'min', name: '最小值'}
                    ]
                },
                markLine : {
                    data : [
                        {type : 'average', name: '平均值'}
                    ]
                }
            }]
        }
        barChart.setOption(option)
    })
}
