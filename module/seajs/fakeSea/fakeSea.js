// 暴露全局接口
var module = {}
;(function () {
    // 保存已经声明，但还未 provided 的模块
    var pendingMods = []
    // 保存已经插入页面中正在下载中的 js 脚本
    var fetchingMods = {}
    // 已经加载好可以使用的模块
    var providedMods = {}

    // 载入脚本函数，重点在于，何时调用 callback
    function load (ids, callback) {
        // 根据 id 获取对应的 uri 地址以便载入 js 文件
        var originalUris = getUris(ids)
        // 筛选掉已经加载的，只 fetch 未加载的 js
        var uris = originalUris
        // 如果依赖都已经加载，就直接调用回调
        if (uris.length === 0) {
            return loadCallback()
        }
        // 遍历 uris 去 fetch
        for(var i = 0, len = uris.length; i < len; i++) {
            (function (uri){
                fetch(uri, loadCallback)
            })(uris[i])
        }
        // 该回调，肯定是要拿到依赖作为参数毫无疑问
        function loadCallback () {
            // load(['util'], function (require, exports) {...}) 如何获取到参数
            var require = createRequire({
                deps: originalUris
            })
            var deps = []
            for(var i = 0, len = ids.length; i < len; i++) {
                deps.push(require(ids[i]))
            }
            callback && callback.apply(null, deps)
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
        fetchingMods[url] = getScript(url, fetchCallback)
        // fetch 函数内声明的回调，会在 script 标签加载完成后调用
        function fetchCallback () {
            // 标签加载完成，就将该模块加入 providedMods 中
            for(var i = 0, len = pendingMods.length; i < len; i++) {
                providedMods[url] = pendingMods[i]
            }
            pendingMods = []
            callback && callback()
        }
    }
    /**
     * 根据 uri 创建 script 标签
     */
    function getScript (url, cb) {
        var node = document.createElement('script')
        // 注册监听事件，当脚本载入成功后，才执行对应的回调函数
        node.addEventListener('load', function () {
            cb && cb()
        })
        node.async = true 
        node.src = url

        var head = document.getElementsByTagName('head')[0]
        // 返回 node
        return head.insertBefore(node, head.firstChild)
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
        // 所以应该在 onload 事件中检查何时才执行回调
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
    /**
     * createRequire，应该是最核心的函数了吧，该函数提供 require、exports 和 module 三个参数
     */
    function createRequire (sandbox) {
        // 该函数用来获取依赖
        function require(id) {
            var mod = providedMods[id + '.js']
            if (!mod.exports) {
                setExports(mod, {
                    parent: sandbox
                })
            }

            return mod.exports
        }

        return require
    }
    function setExports (mod, sandbox) {
        var factory = mod.factory
        mod.exports = {}

        if (typeof factory === 'function') {
            factory(createRequire(sandbox), mod.exports, mod)
        }
    }

    // 暴露接口
    module.load = load
    module.declare = declare
})()