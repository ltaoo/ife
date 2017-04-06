const page = require('webpage').create()
// 从命令行获取搜索关键字
const system = require('system');
// 默认关键词为'百度前端学院'
var keyword = '百度前端学院'
// 如果命令行有传参数，就用命令行的参数作为关键词
// console.log(system.args.length, system.args, system.args[1])
if (system.args.length !== 1) {
    keyword = system.args[1]
}
// 设备 ua
var fs = require('fs')
if (system.args.length === 3) {
    var file = fs.open('./devices.json', 'r')
    var devices = JSON.parse(file.read())
    // console.log(devices)
    const device = devices[system.args[2]]
    if (device) {
        page.settings.userAgent = device.ua
        page.viewportSize = {
            width: device.size[0],
            height: device.size[1]
        }
    }
    file.close()
}
// 请求地址
const searchURL = 'https://www.baidu.com/s?wd=' + encodeURIComponent(keyword)
// 开始时间
const startTime = new Date()
// 请求指定地址
page.open(searchURL, function (status) {
    // 这里只能用 var ？
    var result = {
        code: -1
    }
    if (status !== 'success') {
        result = {
            code: 0,
            msg: '抓取失败',
            word: keyword,
            time: new Date() - startTime
        }
    } else {
        // 截图并保存
        // page.render(keyword + '.png')
        // 采集指定内容
        const dataList = page.evaluate(function () {
            var resultList = document.querySelectorAll('.result')
            console.log(resultList.length)
            var ary = []
            for (var i = 0, len = resultList.length; i < len; i++) {
                var item = resultList[i]
                var _item = {
                    title: item.querySelector('.c-title').innerText,
                    info: item.querySelector('p') ? item.querySelector('p').innerText : item.querySelector('h3').innerText,
                    link: item.querySelector('.c-blocka').href
                }
                if (item.querySelector('img')) {
                    _item.pic = item.querySelector('img').src
                }
                ary.push(_item)
            }
            return ary
        })
        result = {
            code: 1,
            msg: '抓取成功',
            word: keyword,
            time: new Date() - startTime,
            dataList: dataList
        }
    }
    phantom.outputEncoding = 'utf8'
    // console.log(JSON.stringify(result, null, 4))
    console.log(JSON.stringify(result))
    phantom.exit()
})