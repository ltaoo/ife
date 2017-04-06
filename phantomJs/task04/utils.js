var exec = require('child_process').exec

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

module.exports = {
    searchFromBaidu: searchFromBaidu
}