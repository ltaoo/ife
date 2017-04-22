/**
 * 一个指令，连接着 DOM 和对应的数据
 * 这个数据是表达式的值，这个表达式注册了一个 watch，当表达式被调用时就会更新 DOM
 *
 * @param {String} name
 * @param {Node} el
 * @param {Vue} vm
 * @param {Object} descriptor
 *                 - {String} expression
 *                 - {String} [arg]
 *                 - {Array<Object>} [filters]
 * @constructor
 */

function Directive(name, el, vm, descriptor) {
    // public
    this.name = name
    this.el = el
    this.vm = vm
    this.arg = descriptor.arg
    // 表达式就是 {{name}} 中的 name
    this.expression = descriptor.expression
    this.filters = descriptor.filters

    // private
    this._locked = false
    this._bound = false
    // 初始化
    this._initDef()
    this._bind()
}

var p = Directive.prototype

/**
 * 初始化指令的定义
 */

p._initDef = function() {
    // 拿到指令对应的对象，有 bind 和 update 方法，directives/index.js
    var def = this.vm.$options.directives[this.name]
    // 将方法挂载到实例上
    _.extend(this, def)
    // 初始化参数，指令对应的节点
    var el = this.el
    // var attrs = this.paramAttributes
    // if (attrs) {
    //     var params = this.params = {}
    //     attrs.forEach(function(p) {
    //         params[p] = el.getAttribute(p)
    //         el.removeAttribute(p)
    //     })
    // }
}

/**
 * 初始化指令，注册观察者
 * 如果数据改变，就调用指令的 update 方法更新数据
 */

p._bind = function() {
    if (this.expression && !this.literal && this.update) {
        // 初始化观察者
        this._watcher = new Watcher(
            this.vm,
            this.expression,
            this._update, // 回调
            this, // 回调执行上下文
            this.filters,
            this.twoWay // need setter
        )
        // 在这里可以拿到表达式对应的值
        var value = this._watcher.value
        if (this.bind) {
            // 调用 bind 后可以得到 this.attr
            this.bind()
        }
        if (this.update) {
            // 调用 update 其实就是 node[attr] = value 这种形式的复制 attr 会根据节点类型不同而不同
            this.update(value)
        }
    } else {
        if (this.literal) {
            this.expression =
                this.vm.$interpolate(this.expression)
        }
        if (this.bind) {
            this.bind()
        }
    }
    this._bound = true
}

/**
 * Callback for the watcher.
 * Check locked or not before calling definition update.
 *
 * @param {*} value
 * @param {*} oldValue
 */

p._update = function(value, oldValue) {
    if (!this._locked) {
        this.update(value, oldValue)
    }
}

/**
 * Teardown the watcher and call unbind.
 */

p._teardown = function() {
    if (this._bound) {
        if (this.unbind) {
            this.unbind()
        }
        this._watcher.teardown()
        this._bound = false
    }
}

/**
 * Set the corresponding value with the setter.
 * This should only be used in two-way directives
 * e.g. v-model.
 *
 * @param {*} value
 * @param {Boolean} lock - prevent wrtie triggering update.
 * @public
 */

p.set = function(value, lock) {
    if (this.twoWay) {
        if (lock) {
            this._locked = true
        }
        this._watcher.set(value)
        if (lock) {
            _.nextTick(this._unlock, this)
        }
    }
}
