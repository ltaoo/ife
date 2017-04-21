var Cache = require('../cache')
var templateCache = new Cache(100)

var templateParse = {}

var map = {
    _default: [0, '', ''],
    legend: [1, '<fieldset>', '</fieldset>'],
    tr: [2, '<table><tbody>', '</tbody></table>'],
    col: [
        2,
        '<table><tbody></tbody><colgroup>',
        '</colgroup></table>'
    ],
}

map.td =
    map.th = [
        3,
        '<table><tbody><tr>',
        '</tr></tbody></table>'
    ]

map.option =
    map.optgroup = [
        1,
        '<select multiple="multiple">',
        '</select>'
    ]

map.thead =
    map.tbody =
    map.colgroup =
    map.caption =
    map.tfoot = [1, '<table>', '</table>']

map.g =
    map.defs =
    map.text =
    map.circle =
    map.ellipse =
    map.line =
    map.path =
    map.polygon =
    map.polyline =
    map.rect = [
        1,
        '<svg ' +
        'xmlns="http://www.w3.org/2000/svg" ' +
        'xmlns:xlink="http://www.w3.org/1999/xlink" ' +
        'xmlns:ev="http://www.w3.org/2001/xml-events"' +
        'version="1.1">',
        '</svg>'
    ]
// 标签开始正则
var TAG_RE = /<([\w:]+)/

/**
 * 将字符串 template 转换为 fragement
 * Determines correct wrapping by tag types. Wrapping
 * strategy found in jQuery & component/domify.
 *
 * @param {String} templateString
 * @return {DocumentFragment}
 */

function stringToFragment(templateString) {
    // 首先尝试从缓存中查找
    var hit = templateCache.get(templateString)
    if (hit) {
        return hit
    }

    var frag = document.createDocumentFragment()
    // 从 template 中匹配到标签
    var tagMatch = TAG_RE.exec(templateString)

    if (!tagMatch) {
        // 如果没有匹配到 < 这种，表示 template 是文本节点
        frag.appendChild(
            document.createTextNode(templateString)
        )
    } else {
        var tag = tagMatch[1]
        var wrap = map[tag] || map._default
        var depth = wrap[0]
        var prefix = wrap[1]
        var suffix = wrap[2]
        var node = document.createElement('div')

        node.innerHTML = prefix + templateString.trim() + suffix
        while (depth--) {
            node = node.lastChild
        }

        var child
            /* jshint boss:true */
        while (child = node.firstChild) {
            frag.appendChild(child)
        }
    }

    templateCache.put(templateString, frag)
    return frag
}

/**
 * template 是 id 选择器的情况，将对应节点 转换为 Fragment
 * @param {Node} node
 * @return {DocumentFragment}
 */

function nodeToFragment(node) {
    // 拿到该节点的类型
    var tag = node.tagName
    // 如果是 TEMPLATE 标签，并且是浏览器支持的，就可以直接拿到 content，但是这种情况很少
    if (tag === 'TEMPLATE' && node.content instanceof DocumentFragment) {
        return node.content
    }
    // 如果是 SCRIPT 标签就是拿 textContent，不然就是 innerHTML，后者更可能
    return tag === 'SCRIPT' ? stringToFragment(node.textContent) : stringToFragment(node.innerHTML)
}

/**
 * Process the template option and normalizes it into a
 * a DocumentFragment that can be used as a partial or a
 * instance template.
 *
 * @param {*} template
 *    Possible values include:
 *    - DocumentFragment object
 *    - Node object of type Template
 *    - id selector: '#some-template-id'
 *    - template string: '<div><span>{{msg}}</span></div>'
 * @param {Boolean} clone
 * @return {DocumentFragment|undefined}
 */

templateParse.parse = function(template, clone) {
    var node, frag

    // 该函数的目的就是将字符串的 template 转换为 DocumentFragment 以插入 el
    if (template instanceof DocumentFragment) {
        // 如果 template 已经是了，就直接返回
        return template
    }

    if (typeof template === 'string') {
        // 如果 template 首字母是 #，就认定这是一个选择器
        if (template.charAt(0) === '#') {
            // 缓存
            frag = templateCache.get(template)
            // 如果不在缓存中，就去查找到该节点
            if (!frag) {
                node = document.getElementById(template.slice(1))
                if (node) {
                    // 将 node 转换为 fragment
                    frag = nodeToFragment(node)
                    // 将该选择器缓存起来，下次有同名选择器就可以直接获取到
                    templateCache.put(template, frag)
                }
            }
        } else {
            // template 就是普通的字符串
            frag = stringToFragment(template)
        }
    } else if (template.nodeType) {
        // template 已经是节点了
        frag = nodeToFragment(template)
    }

    return frag && clone ? frag.cloneNode(true) : frag
}
