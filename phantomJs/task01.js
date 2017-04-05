const page = require('webpage').create()
// 搜索关键字
const keyword = '百度前端技术学院'
// 请求地址
const searchURL = 'https://www.baidu.com/s?wd=' + encodeURIComponent(keyword)
// 开始时间
const startTime = new Date()
// 请求指定地址
page.open(searchURL, function (status) {
    if (status !== 'success') {
        console.log(JSON.stringify({ 'code': 0,'msg': '抓取失败','err': '网页加载失败' }))
    } else {
        const dataList = page.evaluate(function () {
            return $('#content_left .c-container').map(function(){
                return {
                    title: $(this).find('.t').text() || '',
                    info: $(this).find('.c-abstract').text() || '',
                    link: $(this).find('.t > a').attr('href') || '',
                    pic: $(this).find('.general_image_pic img').attr('src') || ''
                }
            }).toArray()
        })
        const result = {
            code: 1,
            msg: '抓取成功',
            word: keyword,
            time: new Date() - startTime,
            dataList: dataList
        }
        phantom.outputEncoding="utf8"
        console.log(JSON.stringify(result, null, 4))
        phantom.exit()
    }
})