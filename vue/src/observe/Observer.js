var ARRAY = 0
var OBJECT = 1
/**
 * 观察者函数，继承 Emitter 事件分发类，能够监听事件并触发事件
 * @param {String} value 要监听的数据
 * @param {Any}    type  要监听的数据类型
 */
function Observer(value, type) {
    // 实现继承 1
    Emitter.call(this)
        // 声明一个 parents 属性，用来存放该层级下所有属性的监听器
    this.parents = null
    this.value = value
    this.type = type
    if (value) {
        // 先增加 $observer 属性
        _.define(value, '$observer', this)
            // 再根据类型进一步处理
        if (type === ARRAY) {
            // 如果是数组
        } else if (type === OBJECT) {
            // 如果是对象，就用 objectAugmentations 作为该值的原型，其实就是添加了 $add 和 $delete 方法
            // console.log(objectAugmentations)
            _.augment(value, objectAugmentations)
            // 遍历处理每一个值，将每一个值都调用 Object.create() 实现遍历整棵树
            this.walk(value)
        }
    }
}
/**
 * Observer 工厂函数
 */
Observer.create = function (value, options) {
    // 如果要添加 observer 的对象已经有了，直接返回
    if (value && value.hasOwnProperty('$observer') && value.$observer instanceof Observer) {
        return value.$observer
    }
    if (_.isObject(value)) {
        return new Observer(value, OBJECT, options)
    }
}
// 实现继承 2
var p = Observer.prototype = Object.create(Emitter.prototype)
/**
 * 递归函数，仅仅是用来递归，不做额外操作
 * @param {Object} obj 要监听的对象
 */
p.walk = function(obj) {
    for (var key in obj) {
        // 如果该属性确实在 obj 上，就处理它
        if (obj.hasOwnProperty(key)) {
            this.observe(key, obj[key])
            this.convert(key, obj[key])
        }
    }
}
/**
 * 监听属性
 */
p.observe = function(key, val) {
    // 新实例化一个 observer
    var ob = Observer.create(val)
    // 如果 val 是基本类型，则不会创建 $observer ，所以这里是 undefined
    if (ob) {
        if (ob.findParent(this) > -1) return
            // 实现事件冒泡的核心代码在这里，给每个监听器一个 parent 属性，存放着父监听器
            (ob.parents || (ob.parents = [])).push({
                ob: this,
                key: key
            })
    }
}
/**
 * 真正设置 set 和 get 的函数
 */
p.convert = function(key, val) {
    // 不处理私有方法
    if (key.charAt(0) === '$' || key.charAt(0) === '_') {
        return
    }
    var ob = this
    Object.defineProperty(this.value, key, {
        enumerable: true,
        configurable: true,
        get: function() {
            // 广播 get 事件
            console.log('get', key)
            ob.nofify('get', key)
            return val
        },
        set: function(newVal) {
            console.log('set', key, newVal)
            if (val === newVal) return
                // 取消旧值的监听
            ob.unobserve(key)
                // 监听新值
            ob.observe(key, newVal)
                // 广播 set 事件
            ob.nofify('set', newVal)
            val = newVal
        }
    })
}

// 路径分隔符
Observer.pathDelimiter = '\b'
/**
 * 广播事件
 */
p.nofify = function(event, path, val, mutation) {
    this.emit(event, path, val, mutation)
        // 如果该监听器有父监听器，就往上冒泡
    if (!this.parents) return
        // 遍历父监听器并触发事件
    for (var i = 0, len = this.parents.length; i < len; i++) {
        var parent = this.parents[i]
        var ob = parent.ob
        var key = parent.key
        // 重点来了，这里是获取到 "路径"
        var parentPath = path ? (key + Observer.pathDelimiter + path) : key
        ob.nofify(event, parentPath, val, mutation)
    }
}

/**
 * 寻找父监听器
 */
p.findParent = function(parent, remove) {
    var parents = this.parents
    if (!parents) return -1
    var i = parents.length
    while (i--) {
        var p = parents[i]
        if (p.ob === parent) {
            if (remove) parents.splice(i, 1)
            return i
        }
    }
    return -1
}
