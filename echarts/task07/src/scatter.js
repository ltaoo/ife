function scatterInit () {
    /* 将数组转换为符合格式的数组
     * { xxx: xxx} => [{ name: xxx, value: xxx}]
     */
    function convertData(geo, data) {
        const res = []
        // data 从保存了所有数据的对象变成只保存了第一条数据的数组
        data = getData(data)
        for (let i = 0; i < data.length; i++) {
            const geoCoord = geo[data[i].name]
            if (geoCoord) {
                res.push({
                    name: data[i].name,
                    // 将空气质量与城市坐标放在一个数组内
                    value: geoCoord.concat(data[i].value)
                })
            }
        }
        return res
    }
    /* 从全部记录中提取每个城市的一条数据
     * @return <Array>
     */
    function getData(obj) {
        const result = []
        for(let city in obj) {
            result.push({
                name: city,
                value: obj[city][0].value
            })
        }

        return result
    }
    const scatterChart = echarts.init(document.getElementById('scatter'))
    scatterChart.showLoading()
    $.get('./map/china.json', function (json) {
        // 绘制地图
        echarts.registerMap('china', json)
        // 加载城市坐标
        $.get('./map/city.json', function(res) {
            // 坐标数据
            const geoData = res
            // 加载空气质量
            $.get('./aqi/data.json', function (data) {
                scatterChart.hideLoading()
                const option = {
                    backgroundColor: '#404a59',
                    title: {
                        text: '空气质量散点图',
                        textStyle: {
                            color: '#fff'
                        },
                        x: 'center'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: function (params) {
                            return params.name + ' : ' + params.value[2]
                        }
                    },
                    legend: {
                        orient: 'vertical',
                        y: 'bottom',
                        x: 'right',
                        data: ['pm2.5'],
                        textStyle: {
                            color: '#fff'
                        }
                    },
                    visualMap: {
                        min: 0,
                        max: 200,
                        calculable: true,
                        inRange: {
                            color: ['#50a3ba', '#eac736', '#d94e5d']
                        },
                        textStyle: {
                            color: '#fff'
                        }
                    },
                    geo: {
                        map: 'china',
                        label: {
                            emphasis: {
                                show: false
                            }
                        },
                        itemStyle: {
                            normal: {
                                areaColor: '#323c48',
                                borderColor: '#111'
                            },
                            emphasis: {
                                areaColor: '#2a333d'
                            }
                        }
                    },
                    series: [
                    {
                        name: 'pm2.5',
                        type: 'scatter',
                        coordinateSystem: 'geo',
                        data: convertData(geoData, data),
                        symbolSize: 12,
                        label: {
                            normal: {
                                show: false
                            },
                            emphasis: {
                                show: false
                            }
                        },
                        itemStyle: {
                            emphasis: {
                                borderColor: '#fff',
                                borderWidth: 1
                            }
                        }
                    }]
                }
                scatterChart.setOption(option)
            })
        })
    })
}
