// 将函数声明并定义修改为立即执行函数，作用是相同的，但是无法多次调用 CoolModule 方法返回多个“模块”
var foo = (function CoolModule () {
    var something = 'cool'

    var another = [1, 2, 3]

    function doSomething () {
        console.log(something)
    }
    function doAnother () {
        console.log(another.join('!'))
    }

    return {
        doSomething,
        doAnother
    }
})()


foo.doSomething()
foo.doAnother()