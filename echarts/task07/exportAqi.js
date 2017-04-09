const fs = require('fs')
const db = require('./connect')

db.all('SELECT * FROM aqi', function (err, res) {
    if(err) throw err
    fs.writeFile('./aqi/aqi.json', JSON.stringify(res), 'utf8', (err, res) => {
        if (err) throw err
        console.log('生成文件 aqi.json 成功')
    })
})
