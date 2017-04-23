function Binding () {
    // 指令订阅者
    this._subs = []
}
var p = Binding.prototype

/**
 * 添加子 Binding，指定属性与值
 * @param {String} key
 * @param {Binding} child
 */
p._addChild = function (key, child) {
    child = child || new Binding()
    this[key] = child
    return child
}

/**
 * 添加指令订阅者
 * @param {Directive} sub ??
 * @param {Watcher} sub
 */
p._addSub = function (sub) {
    this._subs.push(sub)
}

/**
 * 移除指令订阅者
 * @param {Directive} sub ??
 * @param {Watcher} sub
 */
p._removeSub = function (sub) {
    this._subs.splice(this._subs.indexOf(sub), 1)
}

/**
 * 广播事件，通知所有指令订阅者
 */
p._notify = function () {
    for(var i = 0, len = this._subs.length; i < len; i++) {
        this._subs[i].update()
    }
}