const fs = require('fs')
const path = require('path')
const request = require('request')
const uuid = require('node-uuid')

const lib = require('../utils')
const Results = require('../Model/Results')

let search = async (ctx, next) => {
    console.log(ctx.query)
    var keyword = ctx.query.keyword || '百度前端学院'
    var device = ctx.query.device
    // 请求服务
    try {
        var result = await lib.searchFromBaidu('task04.js', keyword, device)
        // 如果存在图片，则将图片下载至静态文件目录
        console.log(result)
        let data = JSON.parse(result)
        data.dataList = data.dataList.map((item, index) => {
            if (item.pic) {
                // 生成唯一 id
                let imgTitle = uuid.v1() + '.jpg'
                let imgPath = path.join(__dirname, '../assets') + '/' + imgTitle
                request.head(item.pic, function (err, res, body) {
                    request(item.pic)
                        .pipe(fs.createWriteStream(imgPath))
                        .on('close', function () {
                            // 生成本地图片文件获取实际尺寸
                            console.log(imgTitle, '图片下载成功')
                        })
                })
                return Object.assign(item, {
                    localImg: imgTitle
                })
                
            } else {
                return item
            }
        })
        // var res = new Results({
        //     keyword: params.keyword,
        //     device: params.device,
        //     data: data
        // })
        // res.save(function (err) {
        //     if (err) {
        //         console.log(err)
        //         return
        //     }
        //     console.log('写入数据成功')
        //     // ctx.response.body = JSON.stringify()
        // })
        // console.log(data)
        ctx.response.body = JSON.stringify(data)
    } catch (err) {
        ctx.response.body = err
    }
}

module.exports = {
    'GET /search': search
}