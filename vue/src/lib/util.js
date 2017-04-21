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
    extend: function(to, from) {
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
    augment: function(target, prototype) {
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
    isArray: function(val) {
        return Object.prototype.toString.call(val) === '[object Array]'
    },
    /**
     * 判断是否是对象
     * @param {Any} val 要判断的值
     */
    isObject: function(val) {
        return Object.prototype.toString.call(val) === '[object Object]'
    },
    /**
     * to 代理 from 上的 key 属性，即 vm.$data.name === vm.name
     */
    proxy: function(to, from, key) {
        // 如果已经存在该属性，就表示已经代理过了
        if (to.hasOwnProperty(key)) return
        Object.defineProperty(to, key, {
            enumerable: true,
            configurable: true,
            get: function() {
                return from[key]
            },
            set: function(val) {
                from[key] = val
            }
        })
    },
    /**
     * 将类数组对象转换为数组
     */
    toArray: function(ary) {
        return Array.prototype.slice.call(ary)
    },
    guard: function(value) {
        return value === undefined ? '' : value
    },
    /**
     * 获取 node 上 attr 属性的值
     * @param {Element} node
     * @param {String} attr
     */
    attr: function(node, attr) {
        attr = config.prefix + attr
        var val = node.getAttribute(attr)
        if (val !== null) {
            // 如果存在该指令并且有值
            node.removeAttribute(attr)
        }
        return val
    },
    /**
     * 将 target 放到 el 的后面
     * @param {Element} el
     * @param {Element} el
     */
    before: function(el, target) {
        target.parentNode.insertBefore(el, target)
    },
    /**
     * 移除指定节点
     * @param {Element} el
     */
    remove: function(el) {
        el.parentNode.removeChild(el)
    }
}

_.resolveFilters = function(vm, filters, target) {
    if (!filters) {
        return
    }
    var res = target || {}
    var registry = vm.$options.filters
    filters.forEach(function(f) {
        var def = registry[f.name]
        var args = f.args
        var reader, writer
        if (!def) {
            _.warn('Failed to resolve filter: ' + f.name)
        } else if (typeof def === 'function') {
            reader = def
        } else {
            reader = def.read
            writer = def.write
        }
        if (reader) {
            if (!res.read) {
                res.read = []
            }
            res.read.push(function(value) {
                return args ? reader.apply(vm, [value].concat(args)) : reader.call(vm, value)
            })
        }
        // only watchers needs write filters
        if (target && writer) {
            if (!res.write) {
                res.write = []
            }
            res.write.push(function(value) {
                return args ? writer.apply(vm, [value, res.value].concat(args)) : writer.call(vm, value, res.value)
            })
        }
    })
    return res
}

_.applyFilters = function(value, filters) {
    if (!filters) {
        return value
    }
    for (var i = 0, l = filters.length; i < l; i++) {
        value = filters[i](value)
    }
    return value
}
