var module = {}
;(function (global) {
    // 内部保存模块的对象
    var providedMods = {}
    // 使用模块
    function load (ids, callback) {
        var deps = []
        for(var i = 0, len = ids.length; i < len; i++) {
            // 获取保存在 module 内的模块，放入 deps 数组中
            deps[i] = providedMods[ids[i]]
        }

        callback && callback.apply(null, deps)
    }
    // 声明模块
    function declare (name, mod) {
        providedMods[name] = mod
    }

    module.load = load
    module.declare = declare
})(this)