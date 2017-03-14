// 将数据处理为 echarts 能够接收的数据格式
var fs = require('fs')

function create () {
	fs.readFile('./sp500hst.txt', 'utf8', function (err, data) {
	if(err) console.log(err)

		var lines = data.split('\r\n')
		var result = {}
		for(let i = 0, len = lines.length; i < len; i++) {
			var line = lines[i]
			if (line.trim()) {
				var _ary = line.split(',')
				var companyName = _ary[1]
				// 开盘(open)，收盘(close)，最低(lowest)，最高(highest)
				var data = [convert(_ary[0]), parseFloat(_ary[2]), parseFloat(_ary[5]), parseFloat(_ary[4]), parseFloat(_ary[3])]
				result[companyName] = result[companyName] || []
				result[companyName].push(data)
			}
		}

		fs.writeFile('sp500hst.json', JSON.stringify(result), 'utf8', function (err) {
			if(err) console.log(err)

			console.log('生成文件成功')
		})
	})
}

function convert (date) {
	var year = date.slice(0, 4)
	var month = date.slice(4, 6).charAt(0) === '0' ? date.slice(5, 6) : date.slice(4, 6)
	var day = date.slice(6, 8).charAt(0) === '0' ? date.slice(7, 8) : date.slice(6, 8)

	return `${year}/${month}/${day}`
}

create()