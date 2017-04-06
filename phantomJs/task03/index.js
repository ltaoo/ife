var http = require('http')
var url = require('url')
var exec = require('child_process').exec

var mongoose = require('./connect')
// 构建数据模型
var Results = mongoose.model('results', {
    keyword: String,
    device: String,
    data: Array
})

// nodejs 服务端口
var port = 8082

http.createServer(function (req, res) {
    console.log('request received: ', req.url)
    var params = url.parse(req.url, true).query
    // 获取百度搜索结果
    searchFromBaidu(params.keyword, params.device)
        .then(res => {
            // 搜索成功，则将数据保存至数据库中
            // var datalist = JSON.parse(res).dataList
            // console.log(typeof datalist)
            var result = new Results({
                keyword: params.keyword,
                device: params.device,
                data: JSON.parse(res).dataList
            })
            result.save(function (err) {
                if (err) {
                    console.log(err)
                    return
                }
                console.log('写入数据成功')
            })
        })
        .catch(err => {
            console.log(err)
        })
    // 输出
    res.writeHead(200, {
        'Content-Type': 'text/plain'
    })
    res.write('Hello World')
    res.end()
}).listen(port)

console.log('server start at port: ' + port)

function searchFromBaidu (keyword, device) {
    return new Promise(function (resolve, reject) {
        var cmd = 'phantomjs task03.js ' + keyword || '百度前端学院'
        if (device) {
            cmd += ' ' + device
        }
        exec(cmd, function (error, stdout, stderr) {
            if (error) {
                reject(`exec error: ${error}`)
                return
            }
            resolve(stdout)
            // console.log(`stderr: ${stderr}`)
        })
    })
}

