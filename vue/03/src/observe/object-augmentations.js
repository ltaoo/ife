/**
 * 将要被用作对象类型数据的原型
 */
var objectAugmentations = Object.create(Object.prototype)

// 添加 $add 方法，该方法用来往自身添加属性
_.define(objectAugmentations, '$add', function(key, val) {
    // 如果已经存在要添加的属性，就忽略
    if (this.hasOwnProperty(key)) return
        // 添加一个可遍历的属性
    _.define(this, key, val, true)
    ob = this.$observer
    ob.observe(key, val)
    ob.convert(key, val)
    // 触发 added 事件
    ob.notify('added', key, val)
})

// 添加 $delete 方法，该方法用来删除属性
_.define(objectAugmentations, '$delete', function (key) {
    // 如果没有该属性就不执行任何操作
    if (!this.hasOwnProperty(key)) return
    delete this[key]
    this.$observer.notify('deleted', key)
})
