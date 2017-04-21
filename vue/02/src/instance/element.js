/**
 * 在解析 dom 之前，先拿到要处理的 dom
 */
function _initElement (el) {
    if (typeof el === 'string') {
        el = document.querySelector(el)
        // 错误提示
        if (!el) console.log('没有找到该节点')
    }
    this.$el = el
    // 初始化模板
    // this._initTemplate()
    this.$el.__vue__ = this
}

/**
 * 如果存在则处理 template 属性
 */
function _initTemplate () {
    // 拿到根节点和配置项
    var el = this.$el
    var options = this.$options
    // 拿到 template 值
    var template = options.template
    if (template) {
        // 如果存在则使用模板解析器解析
        var frag = templateParse(template, true)
        if (!frag) {
            // 如果解析得到的结果不符合要求，就表示 template 这个值有问题
            console.log('不合法的 template 值')
        } else {
            // 不然就可以进行处理了
            this._collectRawContent()
            if (options.replace) {
                // 如果配置项中还有 replace 字段并且为真
                // 这种情况 el 就是占位符的作用
                if (frag.childNodes.length > 1) {
                    // 如果根节点下还有多个子节点，包括文本节点，所以是用的 childNodes
                    this._blockNodes = _.toArray(frag.childNodes)
                    this.$el = document.createComment('vue-block')
                } else {
                    // 如果
                }
            } else {
                // 如果不是 replace，这种情况是大部分情况，就简单的插入
                el.appendChild(frag)
            }
        }
    }
}

/**
 * 搜集 raw 内容，在 replace 之前插入？
 */
function _collectRawContent () {
    // 先拿到 el
    var el = this.$el
    var child
    if (el.hasChildNodes()) {
        this._rawContent = document.createElement('div')
        while(child = el.firstChild) {
            // 将 el 的元素全部都“转移”到 this._rawContent 中
            this._rawContent.push(child)
        }
    }
}