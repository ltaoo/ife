var config = {
    // 指令前缀
    prefix: 'v-',
    // 支持插值
    interpolate: true,
    _delimitersChanged: true
}
// 插入值的界限符
var delimiters = ['{{', '}}']
Object.defineProperty(config, 'delimiters', {
    get: function () {
        return delimiters
    },
    // 支持修改界限符
    set: function (val) {
        delimiters = val
        this._delimitersChanged = true
    }
})