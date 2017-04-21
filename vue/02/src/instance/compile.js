/**
 * 编译主入口
 */
function _compile () {
    this._compileNode(this.$el)
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
            // this._compileComment(node)
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
    // 有子节点就继续处理子节点
    if (node.hasChildNodes()) {
        _.toArray(node.childNodes).forEach(this._compileNode, this)
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