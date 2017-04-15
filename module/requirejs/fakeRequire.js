var require, define

;(function (global) {
    // 全局配置
    var cfg = {}
    // 标志是否为浏览器环境
    var isBrowser = !!(typeof window !== 'undefined' && typeof navigator !== 'undefined' && window.document)
    if (isBrowser) {
        var scripts = [].slice.call(document.getElementsByTagName('script'))
        for(var i = 0, len = scripts.length; i < len; i++) {
            var script = scripts[i]
            var dataMain = script.getAttribute('data-main')
            if (dataMain) {
                cfg.baseUrl = 'test'
                cfg.deps = ['main']
                break
            }
        }
    }
    // 初始化上下文
    function initContext (cfg) {
        var config = cfg, context, contextName = '_'
        context = newContext(contextName)
    }
    // 旧代码
    var modules = {}
    // 使用模块
    require = function (deps, callback) {
        for (var i = 0, len = deps.length; i < len; i++) {
            // 将依赖数组中的每个元素都从名字修改为真正的函数了
            deps[i] = modules[deps[i]]
        }
        // 核心代码
        callback.apply(callback, deps)
    }
    // 声明模块，先只支持简单的定义对象
    define = function (name, obj) {
        modules[name] = obj
    }
})(this)
