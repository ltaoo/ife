var require, define

;(function (global) {
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

// 这样就声明了一个模块
define('util', {
    color: 'black'
})
// 使用这个模块
// 从这个模块的使用方法上就能看出这个函数该如何定义了
require(['util'], function (util) {
    console.log(util)
})