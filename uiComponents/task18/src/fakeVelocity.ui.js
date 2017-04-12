;(function (window) {
    const Animation = window.Animation

    if (!Animation) {
        window.console.log('必须先引入 velocity.js')
        return
    }

    // 预定义动画
    const effects = {
        "transition.slideUpIn": {
            defaultDuration: 900,
            calls: [
                [{opacity: [1, 0], translateY: [0, 20], translateZ: 0}]
            ]
        },
        "transition.slideUpOut": {
            defaultDuration: 900,
            calls: [
                [{opacity: [0, 1], translateY: -20, translateZ: 0}]
            ],
            reset: {translateY: 0}
        },
        "transition.slideDownIn": {
            defaultDuration: 900,
            calls: [
                [{opacity: [1, 0], translateY: [0, -20], translateZ: 0}]
            ]
        },
        "transition.slideDownOut": {
            defaultDuration: 900,
            calls: [
                [{opacity: [0, 1], translateY: 20, translateZ: 0}]
            ],
            reset: {translateY: 0}
        },
        "transition.slideLeftIn": {
            defaultDuration: 1000,
            calls: [
                [{opacity: [1, 0], translateX: [0, -20], translateZ: 0}]
            ]
        },
        "transition.slideLeftOut": {
            defaultDuration: 1050,
            calls: [
                [{opacity: [0, 1], translateX: -20, translateZ: 0}]
            ],
            reset: {translateX: 0}
        },
        "transition.slideRightIn": {
            defaultDuration: 1000,
            calls: [
                [{opacity: [1, 0], translateX: [0, 20], translateZ: 0}]
            ]
        },
        "transition.slideRightOut": {
            defaultDuration: 1050,
            calls: [
                [{opacity: [0, 1], translateX: 20, translateZ: 0}]
            ],
            reset: {translateX: 0}
        }
    }

    Animation.prototype.effect = function (effectName, options={}) {
        // 先拿到动画对应的值
        console.log(effects, effectName)
        if (effects[effectName]) {
            const properties = effects[effectName]
            let opts = Object.assign(options, {
                duration: properties.defaultDuration
            })
            const propertiesMap = properties.calls[0][0]
            this.animation(propertiesMap, opts)
        }
    }

    Animation.runSequence = function (originalSequence) {
        const sequence = [...originalSequence]
        if (sequence.length > 1) {
            sequence.reverse().forEach((currentSequence, i) => {
                const next = sequence[i + 1]
                if (next) {
                    let options = next.o
                    options.complete = function () {
                        new Animation(currentSequence.e).animated(currentSequence.p, currentSequence.o)
                    }
                    next.options = options
                }
            })
            sequence.reverse()
        }
        const firstSequence = sequence[0]
        new Animation(firstSequence.e).animated(firstSequence.p, firstSequence.o)
    }
})(window)