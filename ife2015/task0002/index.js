/* function $(id) { */
//     return document.getElementById(id)
// }
//
// function add(num1, num2) {
//     return num1 + num2
// }
//
// function renderResult (result) {
//     $("result").innerHTML = result
// }
//
// function addEventHandle () {
//     var num1 = $("number1").value
//     var num2 = $("number2").value
//     var result = add(num1, num2)
//     renderResult(result)
// }
// function initEvent() {
//     $("addbtn").addEventListener("click", addEventHandle, false)
// }
/* initEvent() */

function addClassName(element, newClassName) {
    // console.dir(element)
    element.className += ' ' + newClassName
}

function removeClass(element, oldClassName) {
    var classNameArray = element.className.split(' ')
    var index = classNameArray.indexOf(oldClassName)
    if(index === -1) {
        return 
    }
    element.className = classNameArray.splice(index-1, 1).join(' ')
}
// 判断sibilingNode 和 element 是否为同一父元素下的同一级元素，返回 bool 值
function isSiblingNode (element, sibilingNode) {
    // 判断两个的父元素是否一致  element 和 node 有区别吗？

    if(element.parentNode === sibilingNode.parentNode) {
        return true
    }
    return false
}

function getPosition(element) {
    // offsetLeft 是相对浏览器左侧边距
    // offsetTop 是相对浏览器顶部边距
    return {
        x: element.offsetLeft,
        y: element.offsetTop
    }
}

// 实现简单的 jQuery

function $(selector) {
    // 主要是判断使用了什么选择器
    if(!selector) {
        console.log('not a selector')
        return 
    }
    var classSelector = /^\.{1}[a-z]+/
    var idSelector = /^#{1}[a-z]+/
    var tagSelector = /^[a-z]+/


    if(classSelector.test(selector)) {
        console.log('use class selector')
        return document.getElementsByClassName(selector.replace(/^\./, ''))
    } else if(idSelector.test(selector)) {
        console.log('use id selector')
        return document.getElementById(selector.replace(/^#/, ''))
    } else if(tagSelector.test(selector)) {
        console.log('use tag selector')
        return document.getElementsByTagName(selector)
    } else {
        // 使用属性查找
        console.log('use attribute selector')
        var allTags = document.getElementsByTagName('*')
        var _selector = selector.replace(/(\[|\])/g, '')
        for(var i = 0, len = allTags.length; i < len; i++) {
            var tag = allTags[i]
            var result = tag.getAttribute(_selector)
            // console.log(result)
            if(result) {
                // 如果找到了
                return tag
            }
        }
    }
}

document.body.onload = function () {
    var span = document.getElementById('result')
    // addClassName(span, 'second')
    // 移除 first 
    // removeClass(span, 'first')
    // 判断元素是否为同一级
    var btn = document.getElementById('addbtn')
    // var number1 = document.getElementById('number1')
    // console.log(isSiblingNode(span, number1))
    // var number2 = document.getElementById('number2')
    /* console.log(isSiblingNode(number1, number2)) */
/*     var inner = document.querySelector('.inner') */
    /* console.log(getPosition(inner)) */

    // 测试简单的选择器
    console.log($('#result'))
    console.log($('div'))
    console.log($('.box'))
    console.log($('[data-log]'))
    console.log($('[log]'))

    console.log(document.getElementById('log').getAttribute('data-log'))
}

