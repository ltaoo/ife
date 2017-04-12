;(function (window) {
    /********************
      声明需要额外处理的属性
    *********************/
    const transformProperties = [ "translateX", "translateY", "translateZ", "scale", "scaleX", "scaleY", "scaleZ", "skewX", "skewY", "rotateX", "rotateY", "rotateZ" ]
    const Normalizations = {
        registered: {}
    }
    // 如果这个属性是需要额外处理的
    for(let i = 0, len = transformProperties.length; i < len; i++) {
        const transformName = transformProperties[i]
        Normalizations.registered[transformName] = function (propertyValue) {
            return transformName + '(' + propertyValue + ')'
        }
    }
    // 获取指定 dom 的指定属性值
    function getPropertyValue (element, property) {
        return window.getComputedStyle(element, null).getPropertyValue(property)
    }
    // 给指定 dom 设置值
    function setPropertyValue (element, property, value) {
        let propertyName = property
        let propertyValue = value
        // 判断是否需要额外处理
        if (Normalizations.registered[property]) {
            propertyName = 'transform'
            propertyValue = Normalizations.registered[property](value)
        }
        element.style[propertyName] = propertyValue
    }
    // 分割值与单位
    function separateValue (property, value) {
        // 只处理两种简单的情况，没有单位和单位为 px
        let unitType,
            numericValue
        // replace 是字符串的方法，如果是数值类型则没有 replace 方法
        numericValue = value.toString().replace(/[%A-z]+$/, function(match) {
            unitType = match
            return ""
        })
        // 如果没有获取到单位，就根据属性来获取
        function getUnitType (property) {
            if (/^(rotate|skew)/i.test(property)) {
                // 这两个属性值单位是 deg ，有点特殊
                return "deg"
            } else if (/(^(scale|scaleX|scaleY|scaleZ|opacity|alpha|fillOpacity|flexGrow|flexHeight|zIndex|fontWeight)$)|color/i.test(property)) {
                // 这些属性值都是没有单位的
                return ""
            } else {
                // 如果都没有匹配到，就默认是 px
                return "px"
            }
        }
        if (!unitType) {
            unitType = getUnitType(property)
        }
        return [ numericValue, unitType ]
    }
    // 计算换算比率
    function calculateUnitRatios (element, property) {
        const measurement = 10
        setPropertyValue(element, property, measurement + '%')
        return (parseFloat(getPropertyValue(element, property)) || 1) / measurement
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
    Animation.prototype.animation = function (element, propertiesMap, options={}) {
        // 使用配置项覆盖默认参数
        const opts = Object.assign({
            duration: 400
        }, options)
        // 保存要改变的属性集合
        let propertiesContainer = {}
        for(let property in propertiesMap) {
            // 拿到开始值
            const startSeparatedValue = separateValue(property, getPropertyValue(element, property))
            let startValue = parseFloat(startSeparatedValue[0]) || 0
            const startValueUnitType = startSeparatedValue[1]
            // 结束值
            const endSeparatedValue = separateValue(property, propertiesMap[property])
            const endValue = parseFloat(endSeparatedValue[0]) || 0
            const endValueUnitType = endSeparatedValue[1]

            if (startValueUnitType !== endValueUnitType) {
                const ratios = calculateUnitRatios(element, property)
                startValue *= 1 / ratios
            }

            propertiesContainer[property] = {
                startValue,
                endValue,
                unitType: endValueUnitType
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
            }
            // 终止调用 tick
            if (percentComplete === 1) {
                isTicking = false
                if (opts.complete) {
                    opts.complete.call(null)
                }
            }
            if (isTicking) {
                requestAnimationFrame(tick)
            }
        }
        if (opts.begin) {
            opts.begin.call(null)
        }
        tick()
    }
    Animation.prototype.slideUp = function () {
        const element = this.element
        const animation = this.animation
        // 记住原始高度
        this.originHeight = getPropertyValue(element, 'height')
        animation(element, {
            height: '0px'
        })
    }
    Animation.prototype.slideDown = function () {
        const element = this.element
        const animation = this.animation
        const originHeight = this.originHeight
        animation(element, {
            height: originHeight
        })
    }
    // 暴露至全局
    window.Animation = Animation
})(window)