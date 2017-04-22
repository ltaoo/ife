var batcher = new Batcher()
var uid = 0

/**
 * 观察者，当观察的值发生改变时，就调用回调函数
 * 同时被 $watch api 和 directives 使用
 *
 * @param {Vue} vm
 * @param {String} expression
 * @param {Function} cb
 * @param {Object} [ctx]
 * @param {Array} [filters]
 * @param {Boolean} [needSet]
 * @constructor
 */

function Watcher(vm, expression, cb, ctx, filters, needSet) {
    this.vm = vm
    this.expression = expression
    this.cb = cb // 值发生改变时调用的回调函数
    this.ctx = ctx || vm // 回调函数执行上下文
    // 这个观察者的唯一 id
    this.id = ++uid // uid for batching
    this.value = undefined
    this.active = true
    this.deps = Object.create(null)
    this.newDeps = Object.create(null)
    // setup filters if any.
    // We delegate directive filters here to the watcher
    // because they need to be included in the dependency
    // collection process.
    // var res = _.resolveFilters(vm, filters, this)
    // this.readFilters = res && res.read
    // this.writeFilters = res && res.write
    // 解析表达式得到 set、get 和 path
    var res = expParser.parse(expression, needSet)
    this.getter = res.get
    this.setter = res.set
    this.initDeps(res.paths)
}

var p = Watcher.prototype

/**
 * 初始化值和依赖？
 *
 * Here we need to add root level path as dependencies.
 * This is specifically for the case where the expression
 * references a non-existing root level path, and later
 * that path is created with `vm.$add`.
 *
 * e.g. in "a && a.b", if `a` is not present at compilation,
 * the directive will end up with no dependency at all and
 * never gets updated.
 *
 * @param {Array} paths
 */

p.initDeps = function(paths) {
    var i = paths.length
    while (i--) {
        this.addDep(paths[i])
    }
    // 拿到 data 上的值
    this.value = this.get()
}

/**
 * 添加一个绑定的依赖到指令中
 *
 * @param {String} path
 */

p.addDep = function(path) {
    var vm = this.vm
    var newDeps = this.newDeps
    var oldDeps = this.deps
    if (!newDeps[path]) {
        newDeps[path] = true
        if (!oldDeps[path]) {
            // 获取 _rootBinding
            var binding =
                vm._getBindingAt(path) ||
                vm._createBindingAt(path)
            binding._addSub(this)
        }
    }
    // console.log(binding)
}

/**
 * Evaluate the getter, and re-collect dependencies.
 */

p.get = function() {
    this.beforeGet()
    var value = this.getter.call(this.vm, this.vm.$scope)
    value = _.applyFilters(value, this.readFilters)
    this.afterGet()
    return value
}

/**
 * Set the corresponding value with the setter.
 *
 * @param {*} value
 */

p.set = function(value) {
    value = _.applyFilters(value, this.writeFilters)
    this.setter.call(this.vm, this.vm.$scope, value)
}

/**
 * Prepare for dependency collection.
 */

p.beforeGet = function() {
    Observer.emitGet = true
    this.vm._activeWatcher = this
    this.newDeps = Object.create(null)
}

/**
 * Clean up for dependency collection.
 */

p.afterGet = function() {
    this.vm._activeWatcher = null
    Observer.emitGet = false
    _.extend(this.newDeps, this.deps)
    this.deps = this.newDeps
}

/**
 * Subscriber interface.
 * Will be called when a dependency changes.
 */

p.update = function() {
    batcher.push(this)
}

/**
 * Batcher job interface.
 * Will be called by the batcher.
 */

p.run = function() {
    if (this.active) {
        var value = this.get()
        if (
            (typeof value === 'object' && value !== null) ||
            value !== this.value
        ) {
            var oldValue = this.value
            this.value = value
            this.cb.call(this.ctx, value, oldValue)
        }
    }
}

/**
 * Remove self from all dependencies' subcriber list.
 */

p.teardown = function() {
    if (this.active) {
        this.active = false
        var vm = this.vm
        for (var path in this.deps) {
            vm._getBindingAt(path)._removeSub(this)
        }
    }
}
