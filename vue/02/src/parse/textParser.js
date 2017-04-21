// 需要转义的字符串
var regexEscapeRE = /[-.*+?^${}()|[\]\/\\]/g
var tagRE, htmlRE, lastChar, firstChar
/**
 * 字符串转义，比如 \ 转义为 \\
 */
function escapeRegex (str) {
    return str.replace(regexEscapeRE, '\\$&')
}
/**
 * 解析插入标签的正则，就是 {{}} 这种
 * @return {Regexp}
 */
function compileRegex (){
    config._delimitersChanged = false
    var open = config.delimiters[0]
    var close = config.delimiters[1]
    firstChar = open.charAt(0)
    lastChar = close.charAt(close.length - 1)
    var firstCharRE = escapeRegex(firstChar)
    var lastCharRE = escapeRegex(lastChar)
    var openRE = escapeRegex(open)
    var closeRE = escapeRegex(close)
    // 真正用来匹配的正则，即开始标签，内容和结束标签，共同匹配出一个插入值
    tagRE = new RegExp(
        firstCharRE + '?' + openRE +
        '(.+?)' +
        closeRE + lastCharRE + '?',
        'g'
    )
    htmlRE = new RegExp(
        '^' + firstCharRE + openRE +
        '.*' +
        closeRE + lastCharRE + '$'
    )
}
/**
 * 文本节点解析器
 */
var textParser = {
    parse: function (text) {
        if (config._delimitersChanged) {
            // 生成解析用的正则
            compileRegex()
        }
        // 首先尝试从缓存中命中
        // var hit = cache.get(text)
        // if (hit) return hit
        // 如果将文本匹配正则没有匹配到
        if (!tagRE.test(text)) {
            return null
        }
        // 正式开始解析
        var tokens = []
        // 从位置 0 开始进行解析
        var lastIndex = tagRE.lastIndex = 0
        var match, index, value, oneTime
        while (match = tagRE.exec(text)) {
            index = match.index
            if (index > lastIndex) {
                // 如果第一个位置不是 {{ 开始标签，表示前面还有普通文本
                tokens.push({
                    value: text.slice(lastIndex, index)
                })
            }
            // console.log('*'.charCodeAt(0), 42 .toString(16))
            oneTime = match[1].charCodeAt(0) === 0x2A // 如果第一个符号是 *
            value = oneTime
                ? match[1].slice(1)
                : match[1]
            tokens.push({
                tag: true,
                value: value.trim(),
                html: htmlRE.test(match[0]),
                oneTime: oneTime
            })
            // 匹配完成一个，就将序号往前移动
            lastIndex = index + match[0].length
        }
        // 结束遍历后，检查后面是否还有文本
        if (lastIndex < text.length - 1) {
            tokens.push({
                value: text.slice(lastIndex)
            })
        }
        return tokens
    }
}