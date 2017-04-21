/**
 * 编译主入口
 */
function _compile () {
    if (this._isBlock) {
        // 如果 this 是 block ，表示存在 blockFragment
        // _.toArray(this._blockFragment.childNodes).forEach(this._compileNode, this)
    } else {
        // 否则就直接编译
        this._compileNode(this.$el)
    }
    // 解析完成
    this._isCompiled = true
}

/**
 * 解析节点函数，分不同类型，调用不同的解析函数
 * @param {Node} node 要解析的节点
 */
function _compileNode (node) {
    switch(node.nodeType) {
        case 1: // 普通元素
            if (node.tagName !== 'SCRIPT') {
                this._compileElement(node)
            }
            break
        case 3: // 文本节点
            this._compileTextNode(node)
            break
        case 8: // 注释
            this._compileComment(node)
            break
    }
}

/**
 * 编译 element
 * @param {Node} node 要处理的节点
 */
function _compileElement (node) {
    // 节点名
    var tag = node.tagName
    // textarea 文本域创建的子节点不是我们想编译的？
    if (tag === 'TEXTAREA' && node.value) {
        node.value = this.$interpolate(node.value)
    }
    // 是否有属性
    // var hasAttributes = node.hasAttributes()
    // 先检查属性并提取指令
    // if (hasAttributes) {
    //     if (this._checkPriorityDirectives(node)) return
    // }
    // 检查标签组件
    // if (tag.indexOf('-') > 0 && this.$options.components[tag]) {
    //     this._bindDirective('component', tag, node)
    // }
    // 处理正常指令
    // if (hasAttributes) {
    //     this._compileAttrs(node)
    // }
    // 有子节点就继续处理子节点
    if (node.hasChildNodes()) {
        _.toArray(node.childNodes).forEach(this._compileNode, this)
    }
}

/**
 * 处理属性
 * @param {Node} node 要处理的节点
 */
function _compileAttrs (node) {
    // 获取到节点上的属性
    var attrs = _.toArray(node.attributes)
    var i = attrs.length
    // 拿到已经注册的指令
    var register = this.$options.directives
    var dirs = []
    var attr, attrName, dirName, dir 
    while (i--) {
        attr = attrs[i]
        attrName = attr.name
        // 如果属性名是 v 开头的，就是我们的指令了
        if (attrName.indexOf(config.prefix) === 0) {
            dirName = attrName.slice(config.prefix.length)
            // 如果这个指令名是已知的
            if (register[dirName]) {
                node.removeAttribute(attrName)
                // 将这个指令放到 dirs 中
                dirs.push({
                    name: dirName,
                    value: attr.value
                })
            } else {
                // 指令不存在
                console.log('指令不存在，无法识别')
            }
        } else if (config.interpolate) {
            this._bindAttr(node, attr)
        }
    }
    // 遍历完成，根据优先级排序，从低到高
    dirs.sort(function (a, b) {
        a = a.register[a.name].priority || 0
        b = b.register[b.name].priority || 0
        return a > b ? 1 : -1
    })
    // 再次遍历绑定指令
    var i = dirs.length
    while (i--) {
        dir = dirs[i]
        this._bindDirective(dir.name, dir.value, node)
    }
}

/**
 * 处理文本节点
 * @param {Node}
 */
function _compileTextNode (node) {
    var tokens = textParser.parse(node.nodeValue)
    if (!tokens) return
    // 开始处理 tokens
    var el, token, value
    for(var i = 0, len = tokens.length; i < len; i++) {
        token = tokens[i]
        if (token.tag) {
            if (token.oneTime) {
                // 最终该函数被挂载到 Vue 原型上，所以 this 指的是 vue 实例
                // value = this.$get(token.value)
                // el = token.html
                //     ? templateParser.parse(value, true)
                //     : document.createTextNode(value)
                // // 将 el 放在 node 的前面
                // _.before(el, node)
            } else {
                // 如果 oneTime 是 false，这是大部分情况
                value = token.value
                if (token.html) {
                    el = document.createComment('vue-html')
                    _.before(el, node)
                    // 绑定指令
                    this._bindDirective('html', value, el)
                } else {
                    // 大部分情况会走这里
                    el = document.createTextNode('')
                    _.before(el, node)
                    // 绑定指令，这是重点
                    this._bindDirective('text', value, el)
                }
            }
        } else {
            // 处理文本节点
            el = document.createTextNode(token.value)
            _.before(el, node)
        }
    }
    // 处理完成后，将原节点移除
    _.remove(node)
}

/**
 * 绑定属性
 */
function _bindAttr (node, attr) {
    var name = attr.name
    var value = attr.value
    // 检查是否是参数属性
    var params = this.$options.paramAttributes
    var isParam = node === this.$el && params && params.indexOf(name) > -1
    if (isParam) node.removeAttribute(name)

    // 解析属性值
    var tokens = textParser.parse(value)
    if (!tokens) {
        if (isParam) {
            this.$set(name, value)
        }
        return
    }
    if (tokens.length > 1) {
        console.log('违法属性值', name, value)
    }
    var dirName = isParam ? 'with' : 'attr'
    var arg = name.indexOf(':') > 0 ? "'" + name + "'" : name
    // 绑定指令
    this._bindDirective(dirName, arg + ':' + tokens[0].value, node)
}

/**
 * 检查属性指令
 * @param {Node} node
 */
function _checkPriorityDirectives (node) {
    var value
    if (_.attr(node, 'pre') !== null) {
        return true
    } else if (value = _.attr(node, 'repeat')) {
        this._bindDirective('repeat', value)
        return true
    } else if (value = _.attr(node, 'if')) {
        this._bindDirective('if', value)
        return true
    } else if (value = _.attr(node, 'component')) {
        this._bindDirective('component', value)
        return true
    }
}

/**
 * 绑定指令
 * @param {String} name  指令名
 * @param {String} value 指令对应的值
 * @param {Element} node 节点
 */
function _bindDirective (name, value, node) {
    // 解析指令值，得到 AST {{name}} 就是一个普通的表达式
    var descriptors = dirParser.parse(value)
    // 内部实际指令，指从节点中解析到的指令
    var dirs = this._directives
    for(var i = 0, len = descriptors.length; i < len; i++) {
        // 添加到指令列表中
        dirs.push(
            new Directive(name, node, this, descriptors[i])
        )
    }
}