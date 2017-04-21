/**
 * Vue 内部初始化方法
 * @param {Object} options 配置项
 */
function _init (options) {
    options = options || {}
    // 初始化变量
    this.$el = null
    this._data = options.data || {}
    this._watchers = {}
    // 当前观察者
    this._activeWatcher = null
    // 存放实际解析出来的指令
    this._directives = []
    // 是否完成解析
    this._isCompiled = false
    // 配置项
    this.$options = Object.assign(options, {
        // directives 存放预定义的指令，比如 v-text
        directives: directives
    })
    // 初始化 this.$scope
    this._initScope()
    // 将 options.data 同步到 $scope
    this._initData(this._data, true)
    // 渲染数据到页面
    if (options.el) {
        this.$mount(options.el)
    }
}