// 根据地区导出该地区在有记录时间内的所有空气质量

const fs = require('fs')
const db = require('./connect')

// try {
//     let result = fs.readFileSync('./map/city.json', 'utf8')
//     result = JSON.parse(result)

//     cities = Object.keys(result) 
// }

db.all("SELECT *, datetime(recordDate, 'unixepoch', 'localtime') as time FROM aqi", function (err, res) {
    if(err) throw err
    fs.writeFile('./aqi/aqi.json', JSON.stringify(res), 'utf8', (err, res) => {
        if (err) throw err
        console.log('生成文件 aqi.json 成功')
    })
})
