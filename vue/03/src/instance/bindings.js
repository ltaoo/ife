/**
 * 初始化绑定树
 *
 * Bindings form a tree-like structure that maps the Object
 * structure of observed data. However, only paths present
 * in the templates are created in the binding tree. When a
 * change event from the data observer arrives on the
 * instance, we traverse the binding tree along the changed
 * path to find the corresponding binding, and trigger
 * change for all its subscribers.
 */

function _initBindings() {
    // 每个 vue 实例都有一个 _rootBinding 属性，保存着 Binding 实例
    var root = this._rootBinding = new Binding()
    // the $data binding points to the root itself!
    root._addChild('$data', root)
    // point $parent and $root bindings to their
    // repective owners.
    if (this.$parent) {
        root._addChild('$parent', this.$parent._rootBinding)
        root._addChild('$root', this.$root._rootBinding)
    }
    // 初始化监听器事件
    this.$observer
        // simple updates
        .on('set', this._updateBindingAt.bind(this))
        .on('mutate', this._updateBindingAt.bind(this))
        .on('delete', this._updateBindingAt.bind(this))
        // adding properties is a bit different
        .on('add', this._updateAdd)
        // collect dependency
        .on('get', this._collectDep)
}

/**
 * Retrive a binding at a given path.
 * If `create` is true, create all bindings that do not
 * exist yet along the way.
 *
 * @param {String} path
 * @return {Binding|undefined}
 */

function _getBindingAt(path) {
    return Path.getFromObserver(this._rootBinding, path)
}

/**
 * Create a binding at a given path. Will also create
 * all bindings that do not exist yet along the way.
 *
 * @param {String} path
 * @return {Binding}
 */

function _createBindingAt(path) {
    console.log('_createBindingAt', path)
    path = path.split(Observer.pathDelimiter)
    var b = this._rootBinding
    // var child, key
    // for (var i = 0, l = path.length; i < l; i++) {
    //     key = path[i]
    //     child = b[key] || b._addChild(key)
    //     b = child
    // }
    return b
}

/**
 * Trigger update for the binding at given path.
 *
 * @param {String} path
 */

function _updateBindingAt(path) {
    // root binding updates on any change
    this._rootBinding._notify()
    // var binding = this._getBindingAt(path, true)
    // if (binding) {
    //     binding._notify()
    // }
}

/**
 * For newly added properties, since its binding has not
 * been created yet, directives will not have it as a
 * dependency yet. However, they will have its parent as a
 * dependency. Therefore here we remove the last segment
 * from the path and notify the added property's parent
 * instead.
 *
 * @param {String} path
 */

function _updateAdd(path) {
    var index = path.lastIndexOf(Observer.pathDelimiter)
    if (index > -1) path = path.slice(0, index)
    this._updateBindingAt(path)
}

/**
 * Collect dependency for the target directive being
 * evaluated.
 *
 * @param {String} path
 */

function _collectDep(path) {
    var watcher = this._activeWatcher
        // the get event might have come from a child vm's watcher
        // so this._activeWatcher is not guarunteed to be defined
    if (watcher) {
        watcher.addDep(path)
    }
}
