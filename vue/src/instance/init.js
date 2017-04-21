/**
 * Vue 内部初始化方法
 * @param {Object} options 配置项
 */
function _init (options) {
    options = options || {}
    // 初始化变量
    this.$el = null
    this.$ = {}
    this._data = options.data || {}
    this._rawContent = null
    this._emitter = new Emitter(this)
    this._watchers = {}
    this._activeWatcher = null
    // 组件有指令
    this._directives = []

    this._isBlock = false
    this.blockStart = null
    this.blockEnd = null

    // 是否编译
    this._isCompiled = false
    // 是否被销毁
    this._isDestroyed = false
    // 处理父子组件关系
    this.$parent = options.parent
    this._child = []
    if (this.$parent) {
        this.$parent._child.push(this)
    }
    // 合并配置项
    // this.$options = mergeOptions(
    //     this.constructor.options,
    //     options,
    //     this
    // )
    this.$options = Object.assign(options, {
        directives    : directives,
        partials      : {},
        effects       : {},
        components    : {},
        inheritScope  : true
    })
    this._initScope()
    this._initData(this._data, true)

    // 初始化绑定树，创建 this._rootBinding
    this._initBindings()

    // 渲染数据
    if (options.el) {
        this.$mount(options.el)
    }
}