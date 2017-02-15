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

// console.log(getObjectLength(obj))
console.log('--------- regexp --------- ')
// 判断是否为邮箱
function isEmail(str) {
    // 首先要了解邮箱有什么特点
    /* 1、肯定有 @
     * 2、最后肯定是 .com 结尾 */
    if(/^(\S+)@(\S+)\.com/.test(str)) {
        return true
    }
    return false
}

/* console.log(isEmail('litaowold@aliyun.com')) */
/* console.log(isEmail('litaowold@aliyuncom')) */

// 判断是否是手机号
function isMobilePhone(phone) {
    // 手机号只能包含数字，不过很明显 99999999999 这种也符合，但是不记得到底什么可以啊，所以要查资料，查资料就有直接给出正则
    // 所以没意义
    return /\d{11}/g.test(phone) ? true : false
}
// console.log(isEmail('@aliyun.co'))

/* console.log(isMobilePhone('13822136046')) */
// console.log(isMobilePhone('1003822136046'))
// console.log(isMobilePhone('100382213604a6'))
/* console.log(isMobilePhone('1.00382213604a6')) */


console.log('------------ dom 处理 ------------')
function addClass (element, newClassName) {
    // 实现增加类名
    element.class += ' '+newClassName
}

console.log('------------ 实现简单的 dom 选择器-----------')
function $(selector) {
    var rquick = /^(?:#([\w-]+)|(\w+)|\.[\w-]+)$/

    var match = rquick.exec(selector)

    if(match[1]) {
        // ID Selector
        return document.getElementById(match[1])
    } else if(match[2]) {
        // Tag Selector
        return document.getElementsByTagName(match[2])
    } else if(match[3]) {
        // Class Selector
        return document.getElementsByClassName(match[3])
    }

    // 如果没有匹配到，就说明是属性选择或者多级选择器
    throw new Error('没有匹配到')
}

// console.log($('#result'))

console.log('------------ 实现事件-----------')
function addEvent(element, event, listener) {
    element.addEventListener(event, listener)
}

function clickAlert(event) {
    alert(event)
}
// addEvent($('#addbtn'), 'click', clickAlert)

// 移除事件监听
function removeEvent(element, event, listener) {
    element.removeEventListener(event, listener)
}

// removeEvent($('#addbtn'), 'click', clickAlert)

function addClickEvent (element, listener) {
    // 添加点击事件，就是省去了写 click
    element.addEventListener('click', listener)
}
function addEnterEvent (element, listener) {
    // 首先要明确点击确定键是什么事件
    function _temp(event) {
        if(event.key === 'Enter') {
            listener.call(null, event)
        } 
    }
    element.addEventListener('keydown', _temp)
}

function pressEntry(event) {
    console.log(event)
}
// addEnterEvent($('#number1'), pressEntry)

// 对 $ 函数进行拓展，增加属性

$.on = function (selector, event, listener) {
    addEvent($(selector), event, listener)
}
$.un = function(selector, event, listener) {
    removeEvent($(selector), event, listener)
}
$.click = function(selector, listener) {
    addClickEvent($(selector), listener)
}
$.enter = addEnterEvent

// $.enter('#number1', pressEntry)

function delegateEvent(element, tag, eventName, listener) {
    // your implement
    // 即使增加 dom 也能够实现监听，其实就是监听 element ，因为点击 tag 也会冒泡到 element 上

    element.addEventListener(eventName, listener)
}

$.delegate = function(selector, tag, event, listener) {
    delegateEvent($(selector), tag, event, listener)
}

function clickHandle(event) {
    // 
    console.log(event)
    var target = event.target
    alert(target.innerHTML)
}

// $.delegate('#list', 'li', 'click', clickHandle)

// 再增加 dom 节点仍然可以响应点击事件

// var newLi = document.createElement('li')
// newLi.innerHTML = 'five'
// $('#list').appendChild(newLi)

/* $.click('#addbtn', function (event) { */
    // alert(event.target)
/* }) */

console.log('------------ cookie 处理 ----------- ')
/** 
 * 返回 key=value 组成的数组
 */
function getCookieArray () {
    var allCookie = document.cookie
    /* if(!allCookie.trim()) {
     *     return []
     * }
     * return allCookie.split(';') */

    var match = document.cookie.match(/\w+=\w+/) 
    return match ? match : []
}
/** 
 * 返回包含所有键值对 {key: value} 大对象
 * return <Object>
 */
function getAllCookie() {
    var cookieAry = getCookieArray()
    /* console.log(cookieAry) */
    var cookieObj = {}
    cookieAry.forEach(function (cookie) {
        var _temp = cookie.split('=')
        cookieObj[_temp[0]] = _temp[1]
    })

    return cookieObj
}
/*
 * 设置 cookie 键值对
 * param: <String> cookieName
 * param: <String> cookieValue
 * param: <String> expiredays
 * return: <Boolean>
 */
function setCookie(cookieName, cookieValue, expiredays) {
    if(!cookieName || !cookieValue || cookieName.constructor !== String || cookieValue.constructor !== String) {
        throw new Error('typeError')
        return false
    }
    // 获取到 cookie 对象
    var cookieObj = getAllCookie()
    // 无论怎么样都是这么做，如果已经存在就会覆盖，不存在就新增
    // 先使用 encodeURIComponent 进行处理
    // cookieObj[cookieName] = cookieValue
    // 如果传入了 expiredays 还要额外处理
    var expires = ''
    if(expiredays) {
        switch(expiredays.constructor) {
            case Number:
                // 传入的应该是秒数
                break
            case String:
                expires = new Date(expiredays).toUTCString()
                break
            case Date:
                // 指定时间
                expires = expiredays.toUTCString()
                break
            default:
                // 有一个默认过期时间吗？
        }
    }
    /* if(expiredays && expiredays.constructor === Number) {
     *     // 如果传入的是数字
     *     cookieObj.expires = expiredays
     * } else if(expiredays && expiredays.constructor === String) {
     *     cookieObj.expires = new Date(expiredays).toUTCString()
     * } */
    /* cookieObj.expires = expires */
    /* var cookieStr = cookieObjToString(cookieObj) */
    // console.log(cookieStr)

    // document.cookie 一次只能更新或者设置一个 cookie，应该是在内部有自己处理
    document.cookie = cookieName + "=" + cookieValue + (expires && ";expires=" + expires)
    return true
}
/**
 * 将 cookie 对象转换为字符串并返回
 * param: <Object> cookieObj
 * return: <String> */
function cookieObjToString(cookieObj) {
    // 将 obj 转成字符串
    var _ary = []
    for(var key in cookieObj) {
        _ary.push(key.trim() + "=" + cookieObj[key])
    }
    return _ary.join(';')
}
/* 获取指定 cookie 的值
 * param: <String> cookieName
 * return: <String> */
function getCookie(cookieName) {
    var cookieObj = getAllCookie()
    return cookieObj[cookieName]
}
/**
 * 移除指定 cookie
 * param: <String> cookieName
 * return <Boolean>
 */
function removeCookie(cookieName) {
    // 首先要判断该 cookie 是否存在，因为只能移除已存在的 cookie
    console.log(cookieName)
    if(!cookieName) {return false}
    document.cookie = cookieName + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT"
    return true
}
function removeAllCookie() {
    document.cookie = null
}

