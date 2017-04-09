// 将所有数据安装城市进行分割

const fs = require('fs')

fs.readFile('../aqi/aqi.json', 'utf8', (err, res) => {
    if (err) {
        return console.log(err)
    }

    // 全部的记录
    const data = JSON.parse(res)
    // 用来保存分割好的数据
    const result = {}
    for(let i = 0, len = data.length; i < len; i++) {
        // 得到的是每一条记录
        const item = data[i]
        // 初始化每一个城市对应的值为数组
        result[item.areaName] = result[item.areaName] || []
        result[item.areaName].push({
            time: item.time,
            value: item.value
        })
    }
    const fileName = '../aqi/data.json'
    fs.writeFile(fileName, JSON.stringify(result), 'utf8', (err, res) => {
        if (err) {
            return console.log(err)
        }

        console.log(fileName, '创建成功')
    })
})