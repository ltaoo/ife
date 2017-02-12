function isArray(arr){
    var flag = false
    if(Array.prototype.toString.call(arr) === '[object Array]'){
        flag = true
    }
    // 1、判断该变量的构造函数？
    if(arr.constructor === Array) {
        flag = true
    }
    // 2、判断是否是 Array 的实例？
    console.log(arr instanceof Array)
    // if(arr instanceof Array) {
        //   console.log(ar
            // }

    return flag
}

function isFunction(fn){
    var flag = false
    if(typeof fn === 'function') {
        flag = true
    }

    return flag
}

// 测试判断数组函数
// var ary = [2, 4, 1]
// console.log('should is true', isArray(ary))
// console.log(Array.isArray(ary))
// console.log('should is false', isArray({name: 'ltaoo'}))
// 测试 isFunction 
// console.log(isFunction(isArray))

// 实现对象的深拷贝
function cloneObject(src) {
    var obj = {}

    for(var key in src) {
        // 处理 null 和 undefined
        if(src[key] === null || src[key] === undefined) {
            obj[key] = src[key]
        }
        // 再处理其他类型
        switch(src[key].constructor) {
            case Array:
                // 如果是数组，并且数组内也包含了数组呢？并且深拷贝是要复制的，所以不能简单的引用
                obj[key] = src[key].map(function (item) {
                    if(item.constructor === String 
                        || item.constructor === Number 
                        || item.constructor === Boolean
                        || item === null
                        || item === undefined
                    ) {
                        // 如果是字符串、数字、布尔值、null、undefined 这五种，可以直接返回，其他的调用自身处理,不对啊，但是先简单处理吧
                        return item
                    }
                })
                break
            case String:
                obj[key] = src[key]
                break
            case Boolean:
                obj[key] = src[key]
                break
            case Number:
                obj[key] = src[key]
                break
            case Date:
                obj[key] = src[key]
                break
            case Function:
                // 函数就报错
                throw new Error("src cann't contain function")
                break
            case RegExp:
                // 正则也报错
                throw new Error("src cann't contain regexp")
                break
            default:
                obj[key] = cloneObject(src[key])
        }
    }
    return obj
}
var string = 'string'
// console.log(string.constructor)
console.log(string instanceof Object)
var number = 100
// console.log(number.constructor)
console.log(number instanceof Object)
var boolean = true
// console.log(boolean.constructor)
console.log(boolean instanceof Object)
var _null = null
// console.log(_null.constructor)
console.log(_null instanceof Object)
var _undefined
// console.log(_undefined.constructor)
console.log(_undefined instanceof Object)
function foo () {}
// console.log(foo.constructor)
console.log(foo instanceof Object)
var array = [1]
// console.log(array.constructor)
console.log(array instanceof Object)
var regexp = /hello/
// console.log(regexp.constructor)
console.log(regexp instanceof Object)
var date = new Date() // date 类型的变量只有用构造函数声明
// console.log(date.constructor)
console.log(date instanceof Object)
var object = {}
// console.log(object.constructor)
console.log(object instanceof Object)

var number2 = new Number(10)
console.log(number2 + 4)
console.log(number2.constructor)
console.log(typeof number2)
console.log(number2 instanceof Object)
var number3 = Number(10)
console.log(number3)

// 测试用例：
var srcObj = {
    a: 1,
    b: {
        b1: ["hello", "hi"],
        b2: "JavaScript"
    }
};
// var abObj = srcObj;
// var tarObj = cloneObject(srcObj);
// srcObj.a = 2;
// srcObj.b.b1[0] = "Hello";
// console.log(abObj.a);
// console.log(abObj.b.b1[0]);
// console.log(tarObj.a);      // 1
// console.log(tarObj.b.b1[0]);    // "hello"

