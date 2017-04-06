const fs = require('fs')
const uuid = require('node-uuid')
const request = require('request')

let imgTitle = uuid.v1() + '.jpg'
let path = './assets/' + imgTitle

request.head('https://ss0.bdstatic.com/9bA1vGfa2gU2pMbfm9GUKT-w/timg?wisealaddin&size=u200_200&quality=80&sec=1491469893&di=5dcc892721719aaace720963d061d2a3&src=http%3A%2F%2Fi7.baidu.com%2Fit%2Fu%3D1133680581%2C4139282489%26fm%3D78%26s%3D09413B6E12982D7680F9301D03005090', function (err, res, body) {
    request('https://ss0.bdstatic.com/9bA1vGfa2gU2pMbfm9GUKT-w/timg?wisealaddin&size=u200_200&quality=80&sec=1491469893&di=5dcc892721719aaace720963d061d2a3&src=http%3A%2F%2Fi7.baidu.com%2Fit%2Fu%3D1133680581%2C4139282489%26fm%3D78%26s%3D09413B6E12982D7680F9301D03005090')
        .pipe(fs.createWriteStream(path))
        .on('close', function () {
            // 生成本地图片文件获取实际尺寸
            console.log(imgTitle, '图片下载成功')
        })
})