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
        // 初始化宽度
        var sumWidth = imgs.length*width
        content.style.width = sumWidth + 'px'
        // content.style.left = 0
        content.style.transform = 'translateX(0)'
        // 通过改变 .slider__body 也就是 content 的 left 值实现轮播
        
        /* var timer = setInterval(function () { */
            /* var oldLeft = content.style.left.replace(/px/, '')
             * var newLeft = oldLeft - width + 'px'
             * console.log(imgs.length*width)
             * if(oldLeft < (-((imgs.length-2)*width))) {
             *     newLeft = 0
             * }
             * content.style.left = newLeft */
            // // 使用 transform 实现动画
            // var oldLeft = content.style.transform.match(/[0-9]+/)[0]
            // var newLeft = parseInt(oldLeft) + parseInt(width)
            // console.log(newLeft)
            // content.style.transform = 'translateX(-' + width + 'px)'
        /* }, duration) */
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
            // 计算出每 60 毫秒走过的路程
            var speed = (length/time)*30
            var timer
            var i = parseInt(-start)
            timer = setInterval(function () {
                /* if(i > sumWidth - width) { */
                    // i = 0
                /* } */
                // 检查时间
                if(new Date() > new Date(endTime)) {
                    // 停止动画
                    console.log('stop animated')
                    content.style.transform = 'translateX(' + end + 'px)'
                    clearTimeout(timer)
                }
                i = Math.floor(i + speed)
                console.log('i is : ', i)
                content.style.transform = 'translateX(-' + i + 'px)'
            }, 30)
        }

        // 每隔 duration 调用一次动画
        var start = setInterval(function () {
            // 实现动画，动画有开始位置、结束位置和动画时间
            var startPos = content.style.transform.match(/-?[0-9]+/)[0]
            var endPos = direction === 'left' ? startPos - width : startPos + width
            // 距离/时间 得到 速度
            console.log(startPos, endPos)
            if(-endPos > sumWidth-width) {
                endPos = 0
            }
            // animation(startPos, endPos, 4000)
        }, 5000)
    }

    // 开始轮播
    var slider = new Slider('#slider')
}
