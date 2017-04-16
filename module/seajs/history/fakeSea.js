var module = {}
;(function (global) {
    // 内部保存模块的对象
    var providedMods = {}
    // 临时保存声明的模块
    var pendingMods = []
    // 使用模块
    function load (ids, callback) {
        provide.call(null, ids, function () {
            var args = []
            for(var i = 0, len = ids.length; i < len; i++) {
                var mod = require(ids[i])
                if (mod) {
                    args.push(mod)
                }
            }
            callback && callback.apply(null, args)
        })
    }
    // 
    function provide (ids, callback) {
        // 筛选出未加载的模块
        var urls = getUnMemoized(ids)
        // 如果未加载的模块数量为 0 ，表示都是已经加载好的模块，就可以直接调用回调函数了
        if (urls.length === 0) {
            return callback && callback.apply(null, deps)
        } else {
            // 不然的话就要加载该模块
            for(var i = 0, len = urls.length, count = len; i < len; i++) {
                // 使用 fetch 函数来加载新模块
                fetch(urls[i], function () {
                    // 当模块都加载成功了，才调用回调函数
                    --count === 0 && callback()
                })
            }
        }
    }
    // 声明模块
    function declare (factory) {
        pendingMods.push(factory)
    }
    // 将模块加入到全局对象中
    function memoize (url, mod) {
        providedMods[url] = mod
    }
    // 筛选未加载的模块
    function getUnMemoized (ids) {
        var unLoadMods = []
        for(var i = 0, len = ids.length; i < len; i++) {
            if (!providedMods[ids[i]]) unLoadMods.push(ids[i])
        }

        return unLoadMods
    }
    // 加载新模块
    function fetch (url, callback) {
        var script = document.createElement('script')
        script.addEventListener('load', function () {
            for(var i = 0, len = pendingMods.length; i < len; i++) {
                var mod = pendingMods[i]
                // 加入全局对象
                mod && memoize(url, mod)
            }
            callback()
        })
        script.src = url
        script.async = true
        var head = document.getElementsByTagName('head')[0]
        head.appendChild(script)
    }
    // 获取依赖
    function require(id) {
        var factory = providedMods[id]
        var exports = {}
        if (typeof factory === 'function') {
            factory(exports)
        }
        return exports
    }

    module.load = load
    module.declare = declare
})(this)