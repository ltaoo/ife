/**
 * 重写数组类型数值的原型，主要是拦截数组方法，添加事件广播，这样在调用改变数组的方法时也能够得知
 */
var arrayAugmentations = Object.create(Array.prototype)
;[
    // 向栈底推入
    'push',
    // 从栈底弹出
    'pop',
    // 从栈顶部弹出
    'shift',
    // 向栈顶部推入
    'unshift',
    'splice',
    'sort',
    'reverse'
].forEach(function (method) {
    // 缓存原始方法，因为还是要调用的
    var original = Array.prototype[method]
    _.define(arrayAugmentations, method, function() {
        // 获取参数
        var args = [].slice.call(arguments)
        // 调用原始方法
        var result = original.apply(this, args)
        // 接下来就是额外的处理了
        var ob = this.$observer
        var inserted, removed, index
        switch(method) {
            case 'push':
                inserted = args
                // 为什么这里有 length ，因为 this 是 Array
                index = this.length - args.length
                break
            case 'unshift':
                inserted = args
                // 向栈顶推入肯定是 0
                index = 0
                break
            case 'pop':
                removed = [result]
                index = this.length
                break
            case 'shift':
                removed = [result]
                index = 0
                break
            case 'splice':
                // ?
                inserted = args.slice(2)
                removed = result
                index = arg[0]
                break
        }
        // 如果这次操作插入了数据
        if (inserted) ob.link(inserted, index)
        // 如果是移除数据
        // if (removed) ob.unlink(removed)
        // 广播事件
        if (inserted || removed) {
            ob.notify('set', 'length', this.length)
        }
        // 同时广播该数据被调用了方法
        console.log('调用了', method, args)
        ob.notify('mutate', '', this, {
            method: method,
            args: args,
            result: result,
            index: index,
            inserted: inserted || [],
            removed: removed || []
        })

        return result
    })
})

/**
 * 再给数组类型添加 $set 方法，该方法用来向数组中添加元素
 */
_.define(arrayAugmentations, '$set', function (index, val) {
    if (index > this.length) {
        this.length = index + 1
    }
    return this.splice(index, 1, val)[0]
})
/**
 * 对应的移除元素方法
 */
_.define(arrayAugmentations, '$remove', function (index) {
    if (typeof index !== 'number') {
        index = this.indexOf(index)
    }
    if (index > -1) {
        return this.splice(index, 1)[0]
    }
})