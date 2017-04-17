function Select (selector) {
    var tokens = tokenize(selector)
    console.log(tokens)
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
                matchs: matchs,
                value: matchs[1]
            })
            selector = selector.replace(matchs[0], '')
            continue
        }

        selector = null
    }

    return tokens
}