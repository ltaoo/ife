;(function (window) {
    // 获取指定 dom 的指定属性值
    function getPropertyValue (element, property) {
        return window.getComputedStyle(element, null).getPropertyValue(property)
    }
    // 给指定 dom 设置值
    function setPropertyValue (element, property, value) {
        element.style[property] = value
        return [property, value]
    }
    // 分割值与单位
    function separateValue (value) {
        // 只处理两种简单的情况，没有单位和单位为 px
        const result = /([0-9]+)([a-z]{2})?/.exec(value)
        return [result[1], result[2] || '']
    }

    /* ========================
     * 构造函数
    =========================*/
    function Animation (element) {
        this.element = element
    }
    // easing 缓动函数
    Animation.easing = {
        swing: function (a) {
            return .5 - Math.cos(a * Math.PI) / 2
        }
    }
    // 暴露的动画接口
    Animation.prototype.animation = function (propertiesMap) {
        const element = this.element
        // 默认参数
        const opts = {
            duration: 400
        }
        // 保存要改变的属性集合
        let propertiesContainer = {}
        for(let property in propertiesMap) {
            const startSeparatedValue = separateValue(getPropertyValue(element, property))
            // 拿到开始值
            const startValue = startSeparatedValue[0]
            // 单位值
            const unitType = startSeparatedValue[1]
            // 先处理简单的情况，假设只能改变一个属性
            const endSeparatedValue = separateValue(propertiesMap[property])
            // 结束值
            const endValue = endSeparatedValue[0]
            // 将上面的值都保存到 propertiesContainer 中 参考源码 1812
            propertiesContainer[property] = {
                startValue,
                endValue,
                unitType,
                currentValue: startValue
            }
        }
        let timeStart
        // 终止动画标志
        let isTicking = true
        // 核心动画函数
        function tick () {
            // 当前时间
            let timeCurrent = (new Date).getTime()
            // 遍历要执行动画的 element 元素，这里暂时只支持一个元素
            // 当前值
            // 如果 timeStart 是 undefined ，表示这是动画的第一次执行
            if (!timeStart) {
                timeStart = timeCurrent - 16
            }
            // 检测动画是否执行完毕
            const percentComplete = Math.min((timeCurrent - timeStart) / opts.duration, 1) 

            // 遍历要改变的属性值并一一改变
            for(let property in propertiesContainer) {
                // 拿到该属性当前值，一开始是 startValue
                const tween = propertiesContainer[property]
                // 如果动画执行完成
                if (percentComplete === 1) {
                    currentValue = tween.endValue
                } else {
                    currentValue = parseFloat(tween.startValue) + ((tween.endValue - tween.startValue) * Animation.easing['swing'](percentComplete))
                    tween.currentValue = currentValue
                }
                // 改变 dom 的属性值
                setPropertyValue(element, property, currentValue + tween.unitType)
                // 终止调用 tick
                if (percentComplete === 1) {
                    isTicking = false
                }

                if (isTicking) {
                    requestAnimationFrame(tick)
                }
            }
        }

        tick()
    }

    // 暴露至全局
    window.Animation = Animation
})(window)