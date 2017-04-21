// 创建一个没有原型的空对象
var directives = Object.create(null)

directives.text = {
    bind: function () {
        this.attr = this.el.nodeType === 3
            ? 'nodeValue'
            : 'textContent'
    },
    update: function (value) {
        // guard 是确保不会输出 undefined，会将其转换为 ''
        this.el[this.attr] = _.guard(value)
    }
}