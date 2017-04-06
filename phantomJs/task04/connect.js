// mongodb 依赖
const mongoose = require('mongoose')
// 连接数据库
mongoose.connect('mongodb://localhost:27017/test')

module.exports = mongoose