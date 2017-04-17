function Select (selector) {
    var tokens = tokenize(selector)
    var context = [document]

    for(var i = 0, len = tokens.length; i < len; i++) {
        var token = tokens[i]
        if (token.matchs) {
            context = find[token.type](token.value, context)
        }
    }
    return context
}

function tokenize (selector) {
    var tagRegexp = /^([\w]+)/
    var classRegexp = /^\.([\w]+)/
    var idRegexp = /^#([\w]+)/
    var rcombinators = /^ *([>+~]| ) */

    var tokens = []
    var matchs

    while (selector) {
        // 匹配到类名选择器
        if (matchs = classRegexp.exec(selector)) {
            tokens.push({
                type: 'CLASS',
                matchs: matchs,
                value: matchs[1]
            })
            selector = selector.replace(matchs[0], '')
            continue
        }
        // id 选择器
        if (matchs = idRegexp.exec(selector)) {
            tokens.push({
                type: 'ID',
                matchs: matchs,
                value: matchs[1]
            })
            selector = selector.replace(matchs[0], '')
            continue
        }
        // 标签选择器
        if (matchs = tagRegexp.exec(selector)) {
            tokens.push({
                type: 'TAG',
                matchs: matchs,
                value: matchs[1]
            })
            selector = selector.replace(matchs[0], '')
            continue
        }
        // 连接符
        if (matchs = rcombinators.exec(selector)) {
            tokens.push({
                type: 'COMBINATOR',
                value: matchs[1]
            })
            selector = selector.replace(matchs[0], '')
            continue
        }

        selector = null
    }

    return tokens
}

var find = {
    CLASS: function (s, context) {
        var result = []
        for(var i = 0, len = context.length; i < len; i++) {
            result = result.concat([].slice.call(context[i].getElementsByClassName(s)))
        }
        return result
    },
    ID: function (s) {
        var result = []
        // id 是唯一的，所以直接找就 ok
        result = document.getElementById(s)
        return result ? [result] : []
    },
    TAG: function (s, context) {
        var result = []
        for(var i = 0, len = context.length; i < len; i++) {
            result = result.concat([].slice.call(context[i].getElementsByTagName(s)))
        }
        return result
    }
}