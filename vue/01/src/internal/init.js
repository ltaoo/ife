/**
 * Vue 内部初始化方法
 * @param {Object} options 配置项
 */
function _init (options) {
    // 拿到要监听的数据
    var data = options.data
    // 私有属性，拷贝 data
    var scope = this._scope = {}
    for(var key in data) {
        scope[key] = data[key]
    }
    // 创建监听器，可以看到 create 是静态方法，难道是工厂方法？
    var ob = this._observer = Observer.create(scope, { noProto: true })
}