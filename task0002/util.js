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

/* var number2 = new Number(10) */
// console.log(number2 + 4)
// console.log(number2.constructor)
// console.log(typeof number2)
// console.log(number2 instanceof Object)
// var number3 = Number(10)
/* console.log(number3) */

// 测试用例：
/* var srcObj = { */
//     a: 1,
//     b: {
//         b1: ["hello", "hi"],
//         b2: "JavaScript"
//         }
//     };
// var abObj = srcObj;
// var tarObj = cloneObject(srcObj);
// srcObj.a = 2;
// srcObj.b.b1[0] = "Hello";
// console.log(abObj.a);
// console.log(abObj.b.b1[0]);
// console.log(tarObj.a);
/* console.log(tarObj.b.b1[0]);     */

console.log('--------- 数组去重--------- ')
// 数组去重，只考虑字符串和数字
function uniqArray(arr) {
    var uniq = []
    arr.forEach(function (item) {
        if(uniq.indexOf(item) === -1) {
            // === -1 表示该元素不存在 uniq 数组中
            uniq.push(item)
        }
    })

    return uniq
}

var ary = ['1', 1, 2, 3, 1, '1', 100]
console.log(uniqArray(ary))
// console.log(ary.indexOf(1))

// NaN 也是数字，如果包含该值能否去重？
var ary = [NaN, '1', 1, 2, NaN, 3, 1, '1', 100]
console.log(uniqArray(ary)) //无法成功去重

console.log('--------- trim --------- ')
function trim(str) {
    return str.replace(/(^\s+|\s$)/g, '')
}

/* console.log(trim('    hello   ')) */
// console.log(trim(`
//
//     包含了换行与 tab 键      `))
/* console.log(trim('　　　    使用全角空白 ｉ　　　1１２３ａaｂｃｄｅｆｇ　　  ')) */

console.log('--------- each --------- ')

// 实现对数组中每一个元素调用回调函数
function each(arr, fn) {
    for(var i = 0, len = arr.length; i < len; i++) {
        var item = arr[i]
        fn.call(null, item, i)
    }
}

/* each(['a', 'b'], function(item, index) { */
    // console.log(item, index)
/* }) */

function getObjectLength(obj) {
    var n = 0
    for(var key in obj) {
        n += 1
    }
    return n
}

var obj = {
    a: 1,
    b: 2,
    c: {
        c1: 3,
        c2: 4,
    }
}

console.log(getObjectLength(obj))

