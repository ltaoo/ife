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
    this.value = undefined
    this.active = true
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
    // var i = paths.length
    // while (i--) {
    //     this.addDep(paths[i])
    // }
    this.value = this.get()
}
/**
 * Evaluate the getter, and re-collect dependencies.
 */
p.get = function() {
    this.beforeGet()
    var value = this.getter.call(this.vm, this.vm.$scope)
    this.afterGet()
    return value
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

