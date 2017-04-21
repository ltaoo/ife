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
_.extend(p, { _init: _init })
_.extend(p, { _initScope: _initScope })
_.extend(p, { _initData: _initData })
// element.js 文件
_.extend(p, { _initElement: _initElement })
_.extend(p, { _collectRawContent: _collectRawContent })
// compile.js 文件
_.extend(p, { _compile: _compile })
_.extend(p, { _compileNode: _compileNode })
_.extend(p, { _compileElement: _compileElement })
_.extend(p, { _compileTextNode: _compileTextNode })
_.extend(p, { _bindDirective: _bindDirective })
/**
 * 生命周期
 */
_.extend(p, { $mount: $mount })