// 暴露全局接口
var module = {}
;(function () {
    var scripts = [].slice.call(document.getElementsByTagName('script'))
    for(var i = 0, len = scripts.length; i < len; i++) {
        var script = scripts[i]
        var dataMain = script.getAttribute('data-main')
        if (dataMain) {
            console.log('找到入口文件')
            // 将 data-main 作为第一个脚本文件载入
            load([dataMain])
            break
        }
    }
    // 保存已经声明，但还未 provided 的模块
    var pendingMods = []
    // 载入脚本函数
    function load (ids, callback) {
        // 根据 id 获取对应的 uri 地址以便载入 js 文件
        var originalUris = getUris(ids)
        // 遍历 ids 去 fetch
        for(var i = 0, len = originalUris.length; i < len; i++) {
            // 这个闭包有什么含义？
            (function (uri){
                fetch(uri, callback)
            })(originalUris[i])
        }
    }
    /**
     * 根据 ids 返回对应的 uri 数组
     */
    function getUris (ids) {
        return ids.map(id => {
            return id + '.js'
        })
    }
    /**
     * 
     */
    function fetch (url, callback) {
        getScript(url, callback)
    }
    /**
     * 根据 uri 创建 script 标签
     */
    function getScript (url, cb) {
        var node = document.createElement('script')
        // 注册监听事件，当脚本载入成功后，才执行对应的回调函数
        node.addEventListener('load', cb)
        node.async = true 
        node.src = url

        var head = document.getElementsByTagName('head')[0]
        head.insertBefore(node, head.firstChild)
    }
    /**
     * 声明模块
     */
    function declare (factory) {
        // 将作为参数传入的函数字符串化，使用正则提取出 require('') 字段
        var deps = parseDeps({}.toString.call(factory))
        // 初始化一个模块，因为 declare 就是用来声明模块的，肯定要初始化模块
        var mod = {
            dependencies: deps || [],
            factory: factory
        }
        // 将模块加入 pendingMods 数组中，不过疑问就是，代码能够执行到这里，表示这个文件已经加载成功了
        pendingMods.push(mod)
    }
    /**
     * 从函数中使用正则匹配 require() 字段
     */
    function parseDeps (code) {
        var pattern = /\brequire\s*\(\s*['"]?([^'")]*)/g
        var ret = [], match

        while ((match = pattern.exec(code))) {
            if (match[1]) ret.push(match[1])
        }
        return ret
    }

    // 暴露接口
    module.load = load
    module.declare = declare
})()