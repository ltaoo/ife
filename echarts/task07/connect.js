const sqlite3 = require('sqlite3').verbose()

const db = new sqlite3.Database('./aqi.sqlite')
// 将连接好的数据库导出
module.exports = db


