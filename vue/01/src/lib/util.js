var _ = {
    /**
     * 给对象新增属性
     * @param {Object}  obj        要新增属性的对象
     * @param {String}  key        要新增的属性
     * @param {Any}     val        新增属性对应的值
     * @param {Boolean} enumerable 该属性是否可遍历
     */
    define: function(obj, key, val, enumerable) {
        Object.defineProperty(obj, key, {
            value: val,
            enumerable: !!enumerable,
            writable: true,
            configurable: true
        })
    },
    /**
     * 将 from(源对象) 上的属性复制到 to(目标对象) 上
     * @param {Object} to   目标对象
     * @param {Object} from 源对象
     */
    mixin: function(to, from) {
        for (var key in from) {
            if (to[key] !== from[key]) {
                to[key] = from[key]
            }
        }
    },
    /**
     * 使用指定原型替换对象的原型
     * @param {Object}    target
     * @param {Prototype} prototype
     */
    augment: function (target, prototype) {
        // 如果浏览器支持 __protot__ 属性，直接替换该值即可
        if ('__proto__' in {}) {
            target.__proto__ = prototype
        } else {
            // 暂时不处理
        }
    },
    /**
     * 判断是否是数组
     * @param {Any} val 要判断的值
     */
    isArray: function (val) {
        return Object.prototype.toString.call(val) === '[object Array]'
    },
    /**
     * 判断是否是对象
     * @param {Any} val 要判断的值
     */
    isObject: function (val) {
        return Object.prototype.toString.call(val) === '[object Object]'
    }
}
