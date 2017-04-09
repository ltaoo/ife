const fs = require('fs')
const cityTable = require('./map/area')
// 用来保存最终数据的对象
fs.readFile('./map/allCity.json', 'utf8', (err, res) => {
    if (err) throw err
    const cities = JSON.parse(res)
    const geo = {}
    for(let i = 0, len = cities.length; i < len; i++) {
        const city = cities[i]
        if (city.bottom === 'FALSE') {
            // 处理城市名中的市
            city.name = city.name.replace(/市/, '')
            if (cityTable[city.name]) {
                // console.log(city, cityTable[city.name])
                geo[city.name] = cityTable[city.name]
            }
        }
    }
    // 生成 json 文件
    fs.writeFile('./map/city.json', JSON.stringify(geo), 'utf8', (err, res) => {
        if (err) throw err
        console.log('生成文件 city json 成功')
    })
})

