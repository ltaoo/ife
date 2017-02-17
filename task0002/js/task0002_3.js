document.body.onload = function () {
    /* 轮播图实现
     * @param <String> id 需要实现轮播效果的 id
     * @param <Object> options 配置轮播图图片、轮播效果 */
    function Slider(id, options) {
        if(!id) {
            throw new Error('必须要传入id')
            return
        }
        id = id.replace(/#/, '')
        // 初始化配置项
        options = options || {}
        var duration = options.duration || 1000
        var direction = options.direction || 'left'
        // 验证要显示的图片是否存在
        var imgs = options.images
        /* if(!imgs || imgs.constructor !== Array || imgs.length === 0) {
         *     return
         * } */
        // 获取到轮播图相关节点
        var slider = document.getElementById(id)
        // console.dir(slider)
        var content = slider.getElementsByClassName('slider__body')[0]
        var imgs = slider.getElementsByClassName('slider__item')
        // 获取到尺寸相关信息
        var width = slider.clientWidth
        // console.log(width)
        var height = slider.clientHeight
        // 初始化宽度以及位置
        var sumWidth = imgs.length*width
        content.style.width = sumWidth + 'px'
        content.style.transform = 'translateX(0)'
        // 初始化 dot 和 方向箭头
        var dots = document.createElement('ul')
        dots.className = 'slider__head'
        var _dotItem = ''
        for(var j = 1, _len = imgs.length; j < _len; j++) {
            _dotItem += '<a class="slider__dot" href="#">' + j + '</a>'
        }
        dots.innerHTML = _dotItem
        // 将序号插入到页面中
        slider.insertBefore( dots, content)

        // 处理序号的点击事件
        function jumpToImg(event) {
            event.preventDefault()
            var index = event.target.innerHTML
            // 根据 index 处理
            // content.style.transform = 'translateX(-' + (index-1) * width + 'px)'
            // 拿到当前位置
            var startPos = content.style.transform.match(/-?[0-9]+/)[0]
            // 这里 pos 表示点击的时候是第几张图片
            var pos = Math.abs(Math.floor(startPos/width))
            if(pos >= imgs.length - 1) {
                pos = 0
                content.style.transform = 'translateX(0px)'
            }
            console.log(pos)
            if(pos + 1 === parseInt(index)) {
                console.log('就是这张图片啊，不用点了')
            }
            var currentPos = pos
            var targetPos = index
            var endPos = parseInt(startPos) + (parseInt(currentPos) - parseInt(targetPos))*width
            console.log('点击了', targetPos, '现在是', currentPos, '开始位置是', startPos, '结束位置是', endPos)
            animation(startPos, endPos, 1000)
        }
        dots.addEventListener('click', jumpToImg)

        /*
         * 动画函数，调用该函数，传入开始位置、结束位置以及时间，就能够在指定时间完成动画
         * @param <String> start
         * @param <String> end
         * @param <Number> time 
         */
        function animation(start, end, time) {
            // 开始时间
            var startTime = (new Date()).getTime()
            // 结束时间
            var endTime = startTime + time
            // 总路程
            var length = start - end
            var timer
            var i = -start
            timer = setInterval(function () {
                // 检查时间
                if(new Date() > new Date(endTime)) {
                    // 停止动画
                    console.log('stop animated')
                    clearTimeout(timer)
                    content.style.transform = 'translateX(' + end + 'px)'
                }
                // 计算出每 xx 毫秒走过的路程
                var speed = (length/time)*20
                // i 就是位置，如何计算应该在哪个位置？传入 已消耗的时间、开始位置、结束位置以及动画时间
                i = i + speed
                content.style.transform = 'translateX(-' + i + 'px)'
            }, 20)
        }


        // 每隔 duration 调用一次动画
        var startTimer
        function startAnimated() {
            startTimer = setInterval(function () {
                // 实现动画，动画有开始位置、结束位置和动画时间
                var startPos = content.style.transform.match(/-?[0-9]+/)[0]
                var endPos = direction === 'left' ? startPos - width : startPos + width
                console.log(startPos, endPos)
                // 什么时候返回，这里可以根据配置决定是否循环
                /* 现在假设有三种图片，总宽度为 2800
                 * 第一次移动时开始位置为 0，结束位置为 -700
                 * 第二次移动时开始位置为 -700，结束位置为 -1400
                 * 第三次移动时开始位置为 -1400，结束位置为 -2100
                 * 第四次移动时开始位置为 -2100 重置为 0，结束位置为 -1400 */
                if(-startPos >= sumWidth - width) {
                    console.log('掉头')
                    content.style.transform = 'translateX(0)'
                    startPos = 0
                    endPos = -730
                }
                animation(startPos, endPos, 1000)
            }, 3000)
        }
        /* 鼠标悬停暂停轮播 */
        function stopAnimated() {
            console.log('stop animated')
            startTimer && clearTimeout(startTimer)
        }
        content.addEventListener('mouseout', startAnimated)
        content.addEventListener('mouseover', stopAnimated)

        startAnimated()
    }


    // 开始轮播
    var slider = Slider('#slider')
}
