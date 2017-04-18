/**
 * 向外暴露的构造函数
 */
function Vue (options) {
    this._init(options)
}
var p = Vue.prototype

/****************
   添加原型方法
****************/

/**
 * 私有方法
 */
_.mixin(p, {
    _init: _init
})