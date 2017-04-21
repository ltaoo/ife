var argRE = /^[\w\$-]+$|^'[^']*'$|^"[^"]*"$/
var filterTokenRE = /[^\s'"]+|'[^']+'|"[^"]+"/g

/**
 * 解析器状态
 */

var str
var c, i, l
var inSingle
var inDouble
var curly
var square
var paren
var begin
var argIndex
var dirs
var dir
var lastFilterIndex
var arg
var argC

/**
 * Push a directive object into the result Array
 * 将指令对象放入结果数组中
 */
function pushDir() {
    dir.raw = str.slice(begin, i).trim()
    if (dir.expression === undefined) {
        dir.expression = str.slice(argIndex, i).trim()
    } else if (lastFilterIndex !== begin) {
        pushFilter()
    }
    if (i === 0 || dir.expression) {
        dirs.push(dir)
    }
}

/**
 * Push a filter to the current directive object
 */

function pushFilter() {
    var exp = str.slice(lastFilterIndex, i).trim()
    var filter
    if (exp) {
        filter = {}
        var tokens = exp.match(filterTokenRE)
        filter.name = tokens[0]
        filter.args = tokens.length > 1 ? tokens.slice(1) : null
    }
    if (filter) {
        (dir.filters = dir.filters || []).push(filter)
    }
    lastFilterIndex = i + 1
}

var dirParser = {}
/**
 * 解析指令字符串为类似于 AST 的语法树
 *
 * Example:
 *
 * "click: a = a + 1 | uppercase" will yield:
 * {
 *   arg: 'click',
 *   expression: 'a = a + 1',
 *   filters: [
 *     { name: 'uppercase', args: null }
 *   ]
 * }
 *
 * @param {String} str
 * @return {Array<Object>}
 */
dirParser.parse = function(s) {
    // var hit = cache.get(s)
    // if (hit) {
    //     return hit
    // }
    // 开始解析，重置所有全局变量
    str = s
    inSingle = inDouble = false
    curly = square = paren = begin = argIndex = 0
    lastFilterIndex = 0
    dirs = []
    dir = {}
    arg = null
    // 遍历字符串的每一个字符
    for (i = 0, l = str.length; i < l; i++) {
        c = str.charCodeAt(i)
        if (inSingle) {
            // 检查单引号 
            if (c === 0x27) inSingle = !inSingle
        } else if (inDouble) {
            // 检查双引号
            if (c === 0x22) inDouble = !inDouble
        } else if (
            // 逗号
            c === 0x2C && // comma
            !paren && !curly && !square
        ) {
            // 如果遇到"," 表示一个指令结束,开始下一个指令的解析
            pushDir()
            // reset & skip the comma
            dir = {}
            begin = argIndex = lastFilterIndex = i + 1
        } else if (
            // 冒号
            c === 0x3A &&
            !dir.expression &&
            !dir.arg
        ) {
            // argument
            arg = str.slice(begin, i).trim()
                // test for valid argument here
                // since we may have caught stuff like first half of
                // an object literal or a ternary expression.
            if (argRE.test(arg)) {
                argIndex = i + 1
                argC = arg.charCodeAt(0)
                    // strip quotes
                dir.arg = argC === 0x22 || argC === 0x27 ? arg.slice(1, -1) : arg
            }
        } else if (
            // 管道符，这里是过滤指令
            c === 0x7C &&
            str.charCodeAt(i + 1) !== 0x7C &&
            str.charCodeAt(i - 1) !== 0x7C
        ) {
            if (dir.expression === undefined) {
                // first filter, end of expression
                lastFilterIndex = i + 1
                dir.expression = str.slice(argIndex, i).trim()
            } else {
                // already has filter
                pushFilter()
            }
        } else {
            switch (c) {
                case 0x22:
                    inDouble = true;
                    break // "
                case 0x27:
                    inSingle = true;
                    break // '
                case 0x28:
                    paren++;
                    break // (
                case 0x29:
                    paren--;
                    break // )
                case 0x5B:
                    square++;
                    break // [
                case 0x5D:
                    square--;
                    break // ]
                case 0x7B:
                    curly++;
                    break // {
                case 0x7D:
                    curly--;
                    break // }
            }
        }
    }

    if (i === 0 || begin !== i) {
        pushDir()
    }

    // cache.put(s, dirs)
    return dirs
}
