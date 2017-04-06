var fs = require('fs')
var exec = require('child_process').exec
var request = require('request')

// 从百度进行搜索
function searchFromBaidu (file, keyword, device) {
    return new Promise(function (resolve, reject) {
        var cmd = 'phantomjs ' + file + ' ' + (keyword || '百度前端学院')
        if (device) {
            cmd += ' ' + device
        }
        exec(cmd, function (error, stdout, stderr) {
            if (error) {
                reject(`exec error: ${error}`)
                return
            }
            resolve(stdout)
        })
    })
}

// 生成图片
function createImg (url, path) {
    return new Promise((resolve, reject) => {
        request.head(url, function (err, res, body) {
            if (err) {
                reject(err)
                return
            }
            request(url)
                .pipe(fs.createWriteStream(path))
                .on('close', function () {
                    // 生成本地图片文件获取实际尺寸
                    resolve(path + ' 图片下载成功')
                })
        })
    })
}

module.exports = {
    searchFromBaidu: searchFromBaidu,
    createImg: createImg
}