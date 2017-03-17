
// 返回所有可枚举与不可枚举的属性
// var keys = Object.getOwnPropertyNames(Person)

// console.log(keys)

// console.log(Person.prototype)

// var ltaoo = new Person('ltaoo')

// console.log(Object.getOwnPropertyNames(ltaoo))


function _new(func) {
    // 创建实例
    var instance = {}
    // 原型指向
    instance.prototype = func.prototype
    // 获取到参数
    var params = Array.prototype.slice.call(arguments, 1)
    // 调用一次函数
    func.apply(instance, params) // instance.func(params)
    // 返回实例
    return instance
}

function Person(name) {
    this.name = name
}

var foo = _new(Person, 'foo')
// console.log(foo)

console.log(foo instanceof Person)
