const page = require('webpage').create()
// 从命令行获取搜索关键字
const system = require('system');
// 默认关键词为'百度前端学院'
var keyword = '百度前端学院'
// 如果命令行有传参数，就用命令行的参数作为关键词
console.log(system.args.length, system.args, system.args[1])
if (system.args.length !== 1) {
    keyword = system.args[1]
}
// 请求地址
const searchURL = 'https://www.baidu.com/s?wd=' + encodeURIComponent(keyword)
// 开始时间
const startTime = new Date()
// 请求指定地址
page.open(searchURL, function (status) {
    // 这里只能用 var ？
    var result = null
    if (status !== 'success') {
        result = {
            code: 0,
            msg: '抓取失败',
            word: keyword,
            time: new Date() - startTime
        }
    } else {
        const dataList = page.evaluate(function () {
            var resultList = document.querySelectorAll('.result')
            var ary = []
            for (var i = 0, len = resultList.length; i < len; i++) {
                var item = resultList[i]
                ary.push({
                    title: item.querySelector('.t').innerText,
                    info: item.querySelector('.c-abstract').innerText,
                    link: item.querySelector('.t > a').href,
                    pic: item.querySelector('.c-img') ? item.querySelector('.c-img').src : '没有图片'
                })
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
    console.log(JSON.stringify(result, null, 4))
    phantom.exit()
})