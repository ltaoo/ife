;(function (window) {
    const Animation = window.Animation

    if (!Animation) {
        window.console.log('必须先引入 velocity.js')
        return
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