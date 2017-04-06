var mongoose = require('../connect')
// 构建数据模型
var Results = mongoose.model('results', {
    keyword: String,
    device: String,
    data: Array
})

module.exports = Results