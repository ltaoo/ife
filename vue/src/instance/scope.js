/**
 * 初始化 scope 
 */
function _initScope () {
    var parent = this.$parent
    // 如果该 vm 存在 $parent 属性，并且在配置项中说明了要继承 scope，就表示要继承
    var inherit = parent && this.$options.inheritScope
    // 如果继承，就将父级的 scope 作为自身的 scope
    var scope = this.$scope = inherit ? Object.create(parent.$scope) : {}
    // 创建监听器
    this.$observer = Observer.create(scope, {
        callbackContext: this,
        doNotAlterProto: true
    })
    // 如果不是继承，就是说本次只是普通的初始化操作，就到此结束
    if (!inherit) return
}
/**
 * 初始化 data，该函数紧接着 _initScope 函数调用
 */
function _initData(data, init) {
    var scope = this.$scope
    var key
    // 如果该次操作不是初始化，一般来说就是指不在 _init 函数内调用
    if (!init) {
    }
    // 将 data 上的属性值拷贝至 scope
    for(key in data) {
        // 如果已经存在
        if (scope.hasOwnProperty(key)) {
            scope[key] = data[key]
        } else {
            // 如果不存在，则表示这是一个新属性
            scope.$add(key, data[key])
        }
    }
    // 挂载到 this
    this._data = data
    // 创建 data observer
    this._dataObserver = Observer.create(data)
    // 同步 scope 和 data
    // this._syncData()
}

/**
 * 初始化属性代理
 */
function _initProxy () {
    var scope = this.$scope
    // 就是将 scope 代理到 vm 上
    for(var key in scope) {
        if (scope.hasOwnProperty(key)) {
            _.proxy(this, scope, key)
        }
    }
    // 监听事件
    this.$observer
        // 新增的数据也代理
        .on('add:self', function (key) {
            _.proxy(this, scope, key)
        })
        .on('delete:self', function (key) {
            delete this[key]
        })
    // 代理 parent 和 root， vm -> scope
    _.proxy(scope, this, '$parent')
    _.proxy(scope, this, '$root')
    _.proxy(scope, this, '$data')
}

/**
 * 初始化计算属性
 */
// function _initComputed () {
//     var computed = this.$options.computed
// }

/**
 * 同步 scope 和 data
 */
// function _syncData () {
// }