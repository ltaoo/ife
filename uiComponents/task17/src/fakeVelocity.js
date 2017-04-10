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
        // 假设要改变的值没有单位，比如 opacity
        return [value, '']
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
        let startSeparatedValue,
            startValue,
            unitType,
            endSeparatedValue,
            endValue,
            property // 简单处理的情况，只改变一个属性值，后面这个肯定要删除
        for(property in propertiesMap) {
            startSeparatedValue = separateValue(getPropertyValue(element, property))
            // 拿到开始值
            startValue = startSeparatedValue[0]
            // 单位值
            unitType = startSeparatedValue[1]
            // 先处理简单的情况，假设只能改变一个属性
            endSeparatedValue = separateValue(propertiesMap[property])
            // 结束值
            endValue = endSeparatedValue[0]
        }
        let timeStart
        // 属性当前值，将会逐渐变化，直到变成 endValue
        let currentValue = startValue
        // 终止动画标志
        let isTicking = true
        // 核心动画函数
        function tick () {
            // 当前时间
            let timeCurrent = (new Date).getTime()
            // 当前值
            // 如果 timeStart 是 undefined ，表示这是动画的第一次执行
            if (!timeStart) {
                timeStart = timeCurrent - 16
            }
            // 检测动画是否执行完毕
            const percentComplete = Math.min((timeCurrent - timeStart) / opts.duration, 1) 
            // 如果动画执行完成
            if (percentComplete === 1) {
                currentValue = endValue
            } else {
                currentValue = parseFloat(startValue) + ((endValue - startValue) * Animation.easing['swing'](percentComplete))
            }
            // 改变 dom 的属性值
            setPropertyValue(element, property, currentValue + unitType)
            // 终止调用 tick
            if (percentComplete === 1) {
                isTicking = false
            }

            if (isTicking) {
                requestAnimationFrame(tick)
            }
        }

        tick()
    }

    // 暴露至全局
    window.Animation = Animation
})(window)