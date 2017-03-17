// 实现对象的深拷贝
function cloneObject(src) {
    function isObject(src) {
        if(src instanceof Date) {
            return false
        }
        // 判断参数类型
        if(src instanceof Object) {
            return true
        } 
        return false
    }
    var obj = {}

    for(var key in src) {
        console.log(key)
        if(src[key] === null || src[key] === undefined) {
            obj[key] = src[key]
            continue
        }
        // 处理完了 null 和 undefined 就再处理其他类型
        switch(src[key].constructor) {
            case String:
                obj[key] = src[key]
                break
            case Number:
                obj[key] = src[key]
                break
            case Boolean:
                obj[key] = src[key]
                break
            case Date:
                obj[key] = src[key]
                break
            case Function:
                // 函数就报错
                throw new Error("src cann't contain function")
                break
            case Array:
                // 如果是数组，并且数组内也包含了数组呢？并且深拷贝是要复制的，所以不能简单的引用
                obj[key] = src[key].map(function (item) {
                    if(isObject(item)) {
                        // 如果是对象
                        return cloneObject(item)
                    }
                    return item
                })
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

// 测试用例

var src = {
    _null: null,
    _undefined: undefined,
    _string: 'string',
    _number: 100,
    _boolean: true,
    _array: ['string', 100, null, undefined, true, [], {name: 'ltaoo'}, new Date()],
    _date: new Date('2016/02/03'),
    _object: {
        name: 'ltaoo',
    }
}

var result = cloneObject(src)
console.log(result)

