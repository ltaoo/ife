;(function (window) {
    /********************
      声明需要额外处理的属性
    *********************/
    const transformProperties = [ "translateZ", "scale", "scaleX", "scaleY", "translateX", "translateY", "scaleZ", "skewX", "skewY", "rotateX", "rotateY", "rotateZ" ]
    const Normalizations = {
        registered: {}
    }
    // 如果这个属性是需要额外处理的
    for(let i = 0, len = transformProperties.length; i < len; i++) {
        const transformName = transformProperties[i]
        Normalizations.registered[transformName] = function (propertyValue) {
            // 额外处理矩阵的情况
            if (/matrix/.test(propertyValue)) {
                return propertyValue.split(', ')[i]
            } else {
                return transformName + '(' + propertyValue + ')'
            }
        }
    }
    // 处理颜色值的方法
    const Hooks = {
        backgroundColor: function (rgb) {
            const result = /rgb\(([0-9]+), ?([0-9]+), ?([0-9]+)\)/.exec(rgb)
            return [parseInt(result[1]), parseInt(result[2]), parseInt(result[3])]
        }
    }
    // 十六进制转 rgb
    function hexToRgb (hex) {
        var shortformRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
            longformRegex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i,
            rgbParts
        hex = hex.replace(shortformRegex, function (m, r, g, b) {
            return r + r + g + g + b + b
        })
        rgbParts = longformRegex.exec(hex)
        return rgbParts ? 'rgb(' + (parseInt(rgbParts[1], 16) + ', ' + parseInt(rgbParts[2], 16) + ', ' + parseInt(rgbParts[3], 16)) + ')' : 'rgb(0 0 0)'
    }
    // 解析属性值，主要是处理属性值可能是数组的情况
    function parsePropertyValue (value) {
        let endValue, startValue
        if (Object.prototype.toString.call(value) === '[object Array]') {
            endValue = value[0]
            startValue = value[1]
        } else {
            endValue = value
        }
        return [endValue, startValue]
    }
    // 获取指定 dom 的指定属性值
    function getPropertyValue (element, property) {
        const style = window.getComputedStyle(element, null)
        let value = style[property] ? style[property] : style.getPropertyValue(property)
        // 如果是 transform 属性，上面肯定获取不到正确的值
        if (transformProperties.indexOf(property) > -1 && value === '') {
            // transformValue 如果是计算开始值肯定是有所有的值 translateX translateY rotateZ 等等
            let transformValue = style['transform'] ? style['transform'] : style.getPropertyValue('transform')
            // transformValue 是矩阵
            console.log(transformValue)
            value = Normalizations.registered[property](transformValue)
        }
        return value
    }
    // 给指定 dom 设置值
    function setPropertyValue (element, property, value) {
        let propertyName = property
        let propertyValue = value
        // 判断是否需要额外处理，如果要，比如是 translateX，就不设置值，仅仅计算并返回
        if (Normalizations.registered[property]) {
            propertyName = 'transform'
            propertyValue = Normalizations.registered[property](value)
        } else {
            element.style[propertyName] = propertyValue
        }

        return [propertyName, propertyValue]
    }
    function flushTransformCache (element, transformCache) {
        setPropertyValue(element, 'transform', transformCache.join(' '))
    }
    // 分割值与单位
    function separateValue (property, value) {
        // 只处理两种简单的情况，没有单位和单位为 px
        let unitType,
            numericValue
        // replace 是字符串的方法，如果是数值类型则没有 replace 方法
        if (Hooks[property]) {
            if (/#/.test(value)) {
                value = hexToRgb(value)
            }
            const result = Hooks[property].call(null, value)
            numericValue = result
            unitType = ''
        } else {
            numericValue = value.toString().replace(/[%A-z]+$/, function(match) {
                unitType = match
                return ''
            })
        }
        // 如果没有获取到单位，就根据属性来获取
        function getUnitType (property) {
            if (/^(rotate|skew)/i.test(property)) {
                // 这两个属性值单位是 deg ，有点特殊
                return 'deg'
            } else if (/(^(scale|scaleX|scaleY|scaleZ|opacity|alpha|fillOpacity|flexGrow|flexHeight|zIndex|fontWeight)$)|color/i.test(property)) {
                // 这些属性值都是没有单位的
                return ''
            } else {
                // 如果都没有匹配到，就默认是 px
                return 'px'
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
        // 保存初始属性的对象
        this.originProperties = {}
        // 初始化动画队列
        this.queueList = []
    }
    // easing 缓动函数
    Animation.easing = {
        swing: function (a) {
            return .5 - Math.cos(a * Math.PI) / 2
        }
    }
    // 暴露的动画接口
    Animation.prototype.animation = function ( propertiesMap, options={}) {
        const element = this.element
        // 使用配置项覆盖默认参数
        const opts = Object.assign({
            duration: 400,
            easing: 'swing'
        }, options)
        // 保存要改变的属性集合
        let propertiesContainer = {}
        for(let property in propertiesMap) {
            const valueAry = parsePropertyValue(propertiesMap[property])
            let endValue = valueAry[0]
            let startValue = valueAry[1]
            // 拿到开始值
            if (startValue === undefined) {
                startValue = getPropertyValue(element, property)
            }
            this.originProperties[property] = startValue
            console.log(this.originProperties)
            const startSeparatedValue = separateValue(property, startValue)
            // 额外处理颜色值
            if (Object.prototype.toString.call(startSeparatedValue[0]) === '[object Array]') {
                startValue = startSeparatedValue[0]
            } else {
                startValue = parseFloat(startSeparatedValue[0]) || 0
            }
            // 保存初始状态
            const startValueUnitType = startSeparatedValue[1]
            // 结束值
            const endSeparatedValue = separateValue(property, endValue)
            // 额外处理颜色值
            if (Object.prototype.toString.call(endSeparatedValue[0]) === '[object Array]') {
                endValue = endSeparatedValue[0]
            } else {
                endValue = parseFloat(endSeparatedValue[0]) || 0
            }
            const endValueUnitType = endSeparatedValue[1]

            if (startValueUnitType !== endValueUnitType) {
                const ratios = calculateUnitRatios(element, property)
                startValue *= 1 / ratios
            }
            console.log(startValue, endValue)
            propertiesContainer[property] = {
                startValue,
                endValue,
                unitType: endValueUnitType
            }
        }
        let timeStart
        let isTicking = true
        const _this = this
        let transformCache = []
        let transformPropertyExists = false
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
            let percentComplete = Math.min((timeCurrent - timeStart) / opts.duration, 1) 
            // 遍历要改变的属性值并一一改变
            for(let property in propertiesContainer) {
                // 拿到该属性当前值，一开始是 startValue
                const tween = propertiesContainer[property]
                // 如果动画执行完成
                if (percentComplete === 1 || _this.isEnd) {
                    currentValue = tween.endValue
                    percentComplete = 1
                } else {
                    // 如果是颜色值
                    if (Hooks[property]) {
                        const tempValue = [] 
                        for(let i = 0, len = tween.startValue.length; i < len; i++) {
                            const value = tween.startValue[i] + ((tween.endValue[i] - tween.startValue[i]) * Animation.easing[opts.easing](percentComplete))
                            tempValue.push(parseInt(value))
                        }
                        currentValue = tempValue
                    } else {
                        currentValue = tween.startValue + ((tween.endValue - tween.startValue) * Animation.easing[opts.easing](percentComplete))
                    }
                    tween.currentValue = currentValue
                }
                // 改变 dom 的属性值
                if (Hooks[property]) {
                    currentValue = 'rgb(' + currentValue.join(', ') + ')'
                }
                const adjustedSetData = setPropertyValue(element, property, currentValue + tween.unitType)
                if (adjustedSetData[0] === 'transform') {
                    transformPropertyExists = true
                    transformCache.push(adjustedSetData[1])
                }
            }
            // 这里再次调用？
            if (transformPropertyExists) {
                flushTransformCache(element, transformCache)
                transformCache = []
            }
            // 终止调用 tick
            if (percentComplete === 1) {
                isTicking = false
                _this.dequeue()
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
    // 队列
    Animation.prototype.animated = function (propertiesMap, options) {
        const fnc = this.animation.bind(this, propertiesMap, options)
        this.queue(fnc)
        return this
    }
    Animation.prototype.queue = function (fnc) {
        const queueList = this.queueList
        queueList.push(fnc)
        if (queueList[0] !== 'run') {
            this.dequeue()
        }
    }
    Animation.prototype.dequeue = function () {
        const queueList = this.queueList
        const flag = 'run'

        while(queueList.length) {
            const fnc = queueList.shift()
            if (typeof fnc === 'function') {
                fnc()
                // 向数组顶部加入 run
                queueList.unshift(flag)
                break
            }
        }
    }
    Animation.prototype.slideUp = function () {
        const element = this.element
        // 记住原始高度
        this.originHeight = getPropertyValue(element, 'height')
        this.animation( {
            height: '0px'
        })
    }
    Animation.prototype.slideDown = function () {
        const originHeight = this.originHeight
        if (!originHeight) {
            return
        }
        this.animation({
            height: originHeight
        })
    }
    // 终止动画
    Animation.prototype.stop = function () {
        this.isTicking = false
    }
    // 恢复初始状态
    Animation.prototype.reverse = function () {
        this.animated(this.originProperties)
    }
    // 提取结束动画
    Animation.prototype.finish = function () {
        this.isEnd = true
    }
    // 暴露至全局
    window.Animation = Animation
})(window)