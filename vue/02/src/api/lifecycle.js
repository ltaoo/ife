function $mount (el) {
    // 调用生命周期钩子
    // this._callHook('beforeMount')
    // 初始化节点
    this._initElement(el)
    // 编译
    this._compile()
    // 调用生命周期钩子
    // this._callHook('ready')
}