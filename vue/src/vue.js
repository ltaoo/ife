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
// bindings.js
_.extend(p, { _initBindings: _initBindings })
_.extend(p, { _getBindingAt: _getBindingAt })
_.extend(p, { _createBindingAt: _createBindingAt })
_.extend(p, { _updateBindingAt: _updateBindingAt })
_.extend(p, { _updateAdd: _updateAdd })
_.extend(p, { _collectDep: _collectDep })
// element.js 文件
_.extend(p, { _initElement: _initElement })
// _.extend(p, { _initTemplate: _initTemplate })
_.extend(p, { _collectRawContent: _collectRawContent })
// _.extend(p, { _initContent: _initContent })
// compile.js 文件
_.extend(p, { _compile: _compile })
_.extend(p, { _compileNode: _compileNode })
_.extend(p, { _compileElement: _compileElement })
// _.extend(p, { _compileAttrs: _compileAttrs })
_.extend(p, { _compileTextNode: _compileTextNode })
// _.extend(p, { _bindAttr: _bindAttr })
// _.extend(p, { _checkPriorityDirectives: _checkPriorityDirectives })
_.extend(p, { _bindDirective: _bindDirective })
/**
 * 生命周期
 */
_.extend(p, { $mount: $mount })