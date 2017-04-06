const fs = require('fs')
const path = require('path')
/*
	controller 中间件的作用，就是
	1、获取 controllers 文件夹下的每一个 js 文件
	2、导入得到的每一个 js 文件，得到的是一个对象，对对象进行处理，注册到 router 上
	从这一段描述中，就可以得到三个函数，
*/
// 第一个函数，读取 controllers 文件夹下的文件
function getControllers(dir) {
	let files = fs.readdirSync(path.join(__dirname, '../controllers'))
	return controllers = files.filter(file => {
		return file.endsWith('.js')
	})
}
// 第二个函数
function addMapping(router, obj) {
	for(let url in obj) {
        if (url.startsWith('GET ')) {
            // 如果url类似"GET xxx":
            let uri = url.substring(4);
            router.get(uri, obj[url]);
            console.log(`register URL mapping: GET ${path}`);
        } else if (url.startsWith('POST ')) {
            // 如果url类似"GET xxx":
            let uri = url.substring(5);
            router.post(uri, obj[url]);
            console.log(`register URL mapping: POST ${path}`);
        } else {
            // 无效的URL:
            console.log(`invalid URL: ${url}`);
        }
	}
}

// 最外层的大函数
function addControllers(router, dir) {
	// 将每一个 controller 导入
	let controllers = getControllers(dir)
	controllers.forEach(controller => {
		console.log(`process controller: ${controller}...`)
		// 获得每一个 js 文件导出的对象
		let obj = require(path.join(__dirname, '../controllers', controller))
		// 根据键值对进行处理
		addMapping(router, obj)
	})
}

module.exports = function (dir) {
    let controllers_dir = dir || 'controllers',
        router = require('koa-router')();
    addControllers(router, controllers_dir);
    return router.routes();
};