document.body.onload = function () {
    var input = document.getElementsByClassName('search__input')[0]
    var tipContainer = document.getElementsByClassName('search__tips')[0]

    var tips = document.getElementsByClassName('search__tip')

    var suggestData = ['Simon', 'Erik', 'Kener', 'Kevin']
    // 默认是第 0 个被选中
    var index = 0

    /* @description 监听输入事件，查询 api 获取结果并插入到 tips 容器中
     * @param (Node) container
     * @param (Event) event */
    function inputKeyword(container, event) {
        var value = event.target.value
        tipContainer.style.display = 'block'

        /* if(!value.trim()) {
         *     return
         * } */
        // 每次用户输入都以输入框内的值为搜索条件请求 api 返回结果显示到列表中，暂时使用 mock 数据
        var _tips = ''
        suggestData.forEach(function (item) {

            value = value.toLowerCase()
            item = item.toLowerCase()

            var _reg = new RegExp(value)
            if(!value.trim()) {
                _reg = new RegExp(' ')
            }
            if(_reg.test(item)) {
                // 如果匹配到了
                var _i = item.indexOf(value)
                var _strAry = item.split('')
                var _redStr = '<span style="color: red;">' + value + '</span>'
                var _trueStr = _strAry.splice(_i, value.length, _redStr).join('')
                // console.log(_i, _strAry, _trueStr)
                _tips += '<li class="search__tip">' + _strAry.join('') + '</li>'
            }
        })

        container.innerHTML = _tips
        index = 0
        renderChooseStyle(index, tips)
    }

    input.addEventListener('input', inputKeyword.bind(this, tipContainer))

    function chooseSuggest(value) {
        input.value = value

        input.focus()
    }

    // 点击 tips
    function clickTip(event) {
        // 点击拿到值，赋给输入框并隐藏 tips
        var value = event.target.innerHTML
        chooseSuggest(value)
        tipContainer.style.display = 'none'
    }
    tipContainer.addEventListener('click', clickTip)

    function renderChooseStyle(index, tips) {
        if(tips.length === 0) {
            return
        }
        var ary = Array.from(tips)
        ary.forEach(function (tip) {
            tip.style.background = '#fff'
        })
        ary[index].style.background = '#ccc'
    }

    // 监听键盘
    function pressKey (event) {
        switch(event.keyCode) {
            case 38:
                event.preventDefault()
                // 上箭头
                index -= 1
                if(index < 0) {
                    index = tips.length - 1
                }
                break
            case 40:
                // 下箭头
                index += 1
                if(index > tips.length - 1) {
                    index = 0
                }
                break
            case 13:
                // 确定
                // chooseSuggest(tips[index].text)
                chooseSuggest(tips[index].innerText)
                tipContainer.style.display = 'none'
                break
            default:
                return
        }

        // 改变样式
        renderChooseStyle(index, tips)

    }
    input.addEventListener('keydown', pressKey)

}
