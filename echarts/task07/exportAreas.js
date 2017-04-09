/* 由于 sqlite 数据库 areas 表中并没有地区的经纬度，无法在 echarts 中显示
 * 所以筛选出已知经纬度的城市，先将所有地区导出为 json
 */
const fs = require('fs')
const db = require('./connect')

// 已知经纬度的城市表
const cityTable = require('./map/area')

db.all('SELECT * FROM areas', function (err, res) {
    if(err) throw err
    fs.writeFile('./map/allCity.json', JSON.stringify(res), 'utf8', (err, res) => {
        if (err) throw err
        console.log('生成文件 allCity.json 成功')
    })
})
