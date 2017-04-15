var MyModules = (function Manager () {
    var modules = {}

    function define (name, deps, impl) {
        for (var i = 0; i < deps.length; i++) {
            deps[i] = modules[deps[i]]
        }
        // 核心，将函数保存在了 modules 内
        modules[name] = impl.apply(impl, deps)
    }

    function get (name) {
        return modules[name]
    }

    return {
        define: define,
        get: get
    }
})()

// 定义模块
MyModules.define('bar', [], function () {
    function hello (who) {
        return 'Let me introduce: ' + who
    }

    return {
        hello: hello
    }
})
MyModules.define('foo', ['bar'], function (bar) {
    var hungry = 'hippo'

    function awesome () {
        console.log(bar.hello(hungry).toUpperCase())
    }

    return {
        awesome: awesome
    }
})

// OK，从这里可以看到，由于这是一个闭包，所以MyModules 可以给 foo 对应
// 的函数需要的东西比如这里的 bar

// 所以 foo 可以使用 bar 的方法
var foo = MyModules.get('foo')
foo.awesome()