!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.Vue=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
exports.$get = function () {
    
}

exports.$set = function () {
    
}

exports.$add = function () {
  
}

exports.$delete = function () {
  
}

exports.$watch = function () {
    
}

exports.$unwatch = function () {
    
}

exports.$toJSON = function () {
  
}

exports.$log = function () {
  
}
},{}],2:[function(_dereq_,module,exports){
exports.$appendTo = function () {
    
}

exports.$prependTo = function () {
    
}

exports.$before = function () {
    
}

exports.$after = function () {
    
}

exports.$remove = function () {
    
}
},{}],3:[function(_dereq_,module,exports){
;['emit', 'on', 'off', 'once'].forEach(function (method) {
    exports[method] = function () {
        
    }
})

exports.$broadcast = function () {
    
}

exports.$dispatch = function () {
    
}
},{}],4:[function(_dereq_,module,exports){
var _ = _dereq_('../util')
var config = _dereq_('../config')

/**
 * Configuration
 */

exports.config = function () {
  
}

/**
 * Class inehritance
 */

exports.extend = function () {
  
}

/**
 * Plugin system
 */

exports.use = function () {
  
}

/**
 * Expose some internal utilities
 */

exports.require = function () {
  
}

/**
 * Define asset registries and registration
 * methods on a constructor.
 */

config.assetTypes.forEach(function (type) {
  var registry = '_' + type + 's'
  exports[registry] = {}

  /**
   * Asset registration method.
   *
   * @param {String} id
   * @param {*} definition
   */

  exports[type] = function (id, definition) {
    this[registry][id] = definition
  }
})

/**
 * This is pretty useful so we expose it as a global method.
 */

exports.nextTick = _.nextTick
},{"../config":6,"../util":13}],5:[function(_dereq_,module,exports){
exports.$mount = function () {
    
}

exports.$destroy = function () {
    
}
},{}],6:[function(_dereq_,module,exports){
module.exports = {

  assetTypes: [
    'directive',
    'filter',
    'partial',
    'effect',
    'component'
  ]

}
},{}],7:[function(_dereq_,module,exports){
/**
 * Simple event emitter based on component/emitter.
 *
 * @constructor
 * @param {Object} ctx - the context to call listners with.
 */

function Emitter (ctx) {
  this._ctx = ctx || this
}

var p = Emitter.prototype

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 */

p.on = function (event, fn) {
  this._cbs = this._cbs || {}
  ;(this._cbs[event] || (this._cbs[event] = []))
    .push(fn)
  return this
}

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 */

p.once = function (event, fn) {
  var self = this
  this._cbs = this._cbs || {}

  function on () {
    self.off(event, on)
    fn.apply(this, arguments)
  }

  on.fn = fn
  this.on(event, on)
  return this
}

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 */
 
p.off = function (event, fn) {
  this._cbs = this._cbs || {}

  // all
  if (!arguments.length) {
    this._cbs = {}
    return this
  }

  // specific event
  var callbacks = this._cbs[event]
  if (!callbacks) return this

  // remove all handlers
  if (arguments.length === 1) {
    delete this._cbs[event]
    return this
  }

  // remove specific handler
  var cb
  for (var i = 0; i < callbacks.length; i++) {
    cb = callbacks[i]
    if (cb === fn || cb.fn === fn) {
      callbacks.splice(i, 1)
      break
    }
  }
  return this
}

/**
 * The internal, faster emit with fixed amount of arguments
 * using Function.call.
 *
 * @param {Object} event
 * @return {Emitter}
 */

p.emit = function (event, a, b, c) {
  this._cbs = this._cbs || {}
  var callbacks = this._cbs[event]

  if (callbacks) {
    callbacks = callbacks.slice(0)
    for (var i = 0, len = callbacks.length; i < len; i++) {
      callbacks[i].call(this._ctx, a, b, c)
    }
  }

  return this
}

/**
 * The external emit using Function.apply, used
 * by Vue instance event methods.
 *
 * @param {Object} event
 * @return {Emitter}
 */

p.applyEmit = function (event) {
  this._cbs = this._cbs || {}
  var callbacks = this._cbs[event], args

  if (callbacks) {
    callbacks = callbacks.slice(0)
    args = callbacks.slice.call(arguments, 1)
    for (var i = 0, len = callbacks.length; i < len; i++) {
      callbacks[i].apply(this._ctx, args)
    }
  }

  return this
}

module.exports = Emitter
},{}],8:[function(_dereq_,module,exports){
function Compiler () {
    
}

module.exports = Compiler
},{}],9:[function(_dereq_,module,exports){
var Observer = _dereq_('../observe/observer')
var _ = _dereq_('../util')
exports._init = function (options) {

  var data = options.data
  var parent = options.parent
  var scope = this._scope = parent
    ? Object.create(parent._scope)
    : {}

  // copy instantiation data into scope
  for (var key in data) {
    if (key in scope) {
      // key exists on the scope prototype chain
      // cannot use direct set here, because in the parent
      // scope everything is already getter/setter and we
      // need to overwrite them with Object.defineProperty.
      _.define(scope, key, data[key], true)
    } else {
      scope[key] = data[key]
    }
  }

  // create observer
  // pass in noProto:true to avoid mutating the __proto__
  var ob = this._observer = Observer.create(scope, { noProto: true })
  var dob = Observer.create(data)
  var locked = false

  // sync scope and original data.
  ob
    .on('set', guard(function (key, val) {
      data[key] = val
    }))
    .on('added', guard(function (key, val) {
      data.$add(key, val)
    }))
    .on('deleted', guard(function (key) {
      data.$delete(key)
    }))

  // also need to sync data object changes to scope...
  // this would cause cycle updates, so we need to lock
  // stuff when one side updates the other
  dob
    .on('set', guard(function (key, val) {
      scope[key] = val
    }))
    .on('added', guard(function (key, val) {
      scope.$add(key, val)
    }))
    .on('deleted', guard(function (key) {
      scope.$delete(key)
    }))
  // 警卫，顾名思义保护？
  function guard (fn) {
    return function (key, val) {
      if (locked || key.indexOf(Observer.pathDelimiter) > -1) {
        return
      }
      locked = true
      fn(key, val)
      locked = false
    }
  }

  // relay change events from parent scope.
  // this ensures the current Vue instance is aware of
  // stuff going on up in the scope chain.
  if (parent) {
    var po = parent._observer
    ;['set', 'mutate', 'added', 'deleted'].forEach(function (event) {
      po.on(event, function (key, a, b) {
        if (!scope.hasOwnProperty(key)) {
          ob.emit(event, key, a, b)
        }
      })
    })
  }

  // proxy everything on self
  for (var key in scope) {
    _.proxy(this, scope, key)
  }

  // also proxy newly added keys.
  var self = this
  ob.on('added', function (key) {
    _.proxy(self, scope, key)
  })
  
}
},{"../observe/observer":12,"../util":13}],10:[function(_dereq_,module,exports){
var _ = _dereq_('../util')
var slice = [].slice
var arrayAugmentations = Object.create(Array.prototype)

/**
 * Intercept mutating methods and emit events
 */

;[
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]
.forEach(function (method) {
  // cache original method
  var original = Array.prototype[method]
  // define wrapped method
  _.define(arrayAugmentations, method, function () {
    
    var args = slice.call(arguments)
    var result = original.apply(this, args)
    var ob = this.$observer
    var inserted, removed, index

    switch (method) {
      case 'push':
        inserted = args
        index = this.length - args.length
        break
      case 'unshift':
        inserted = args
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
        inserted = args.slice(2)
        removed = result
        index = args[0]
        break
    }

    // link/unlink added/removed elements
    if (inserted) ob.link(inserted, index)
    if (removed) ob.unlink(removed)

    // update indices
    if (method !== 'push' && method !== 'pop') {
      ob.updateIndices()
    }

    // emit length change
    if (inserted || removed) {
      ob.notify('set', 'length', this.length)
    }

    // empty path, value is the Array itself
    ob.notify('mutate', '', this, {
      method   : method,
      args     : args,
      result   : result,
      index    : index,
      inserted : inserted || [],
      removed  : removed || []
    })

    return result
  })
})

/**
 * Swap the element at the given index with a new value
 * and emits corresponding event.
 *
 * @param {Number} index
 * @param {*} val
 * @return {*} - replaced element
 */

_.define(arrayAugmentations, '$set', function (index, val) {
  if (index >= this.length) {
    this.length = index + 1
  }
  return this.splice(index, 1, val)[0]
})

/**
 * Convenience method to remove the element at given index.
 *
 * @param {Number} index
 * @param {*} val
 */

_.define(arrayAugmentations, '$remove', function (index) {
  if (typeof index !== 'number') {
    index = this.indexOf(index)
  }
  if (index > -1) {
    return this.splice(index, 1)[0]
  }
})

module.exports = arrayAugmentations
},{"../util":13}],11:[function(_dereq_,module,exports){
var _ = _dereq_('../util')
var objectAgumentations = Object.create(Object.prototype)

/**
 * Add a new property to an observed object
 * and emits corresponding event
 *
 * @param {String} key
 * @param {*} val
 * @public
 */

_.define(objectAgumentations, '$add', function (key, val) {
  if (this.hasOwnProperty(key)) return
  // make sure it's defined on itself.
  _.define(this, key, val, true)
  var ob = this.$observer
  ob.observe(key, val)
  ob.convert(key, val)
  ob.notify('added', key, val)
})

/**
 * Deletes a property from an observed object
 * and emits corresponding event
 *
 * @param {String} key
 * @public
 */

_.define(objectAgumentations, '$delete', function (key) {
  if (!this.hasOwnProperty(key)) return
  delete this[key]
  this.$observer.notify('deleted', key)
})

module.exports = objectAgumentations
},{"../util":13}],12:[function(_dereq_,module,exports){
var _ = _dereq_('../util')
var Emitter = _dereq_('../emitter')
var arrayAugmentations = _dereq_('./array-augmentations')
var objectAugmentations = _dereq_('./object-augmentations')

/**
 * Type enums
 */

var ARRAY  = 0
var OBJECT = 1

/**
 * Observer class that are attached to each observed
 * object. Observers can connect to each other like nodes
 * to map the hierarchy of data objects. Once connected,
 * detected change events can propagate up the nested chain.
 *
 * The constructor can be invoked without arguments to
 * create a value-less observer that simply listens to
 * other observers.
 *
 * @constructor
 * @extends Emitter
 * @param {Array|Object} value
 * @param {Number} type
 * @param {Object} [options]
 */

function Observer (value, type, options) {
  Emitter.call(this)
  this.value = value
  this.type = type
  this.parents = null
  if (value) {
    _.define(value, '$observer', this)
    if (type === ARRAY) {
      _.augment(value, arrayAugmentations) // augment 作用是将第二个参数作为第一个参数的原型
      this.link(value)
    } else if (type === OBJECT) {
      if (options && options.noProto) { // noProto: true
        _.deepMixin(value, objectAugmentations)
      } else {
        _.augment(value, objectAugmentations)
      }
      this.walk(value)
    }
  }
}

var p = Observer.prototype = Object.create(Emitter.prototype)

/**
 * Simply concatenating the path segments with `.` cannot
 * deal with keys that happen to contain the dot.
 *
 * Instead of the dot, we use the backspace character
 * which is much less likely to appear in property keys.
 */

Observer.pathDelimiter = '\b'

/**
 * Switch to globally control whether to emit get events.
 * Only enabled during dependency collections.
 */

Observer.emitGet = false

/**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 *
 * @param {*} value
 * @param {Object} [options]
 * @return {Observer|undefined}
 * @static
 */

Observer.create = function (value, options) {
  if (value &&
      value.hasOwnProperty('$observer') &&
      value.$observer instanceof Observer) {
    return value.$observer
  } 
  if (_.isArray(value)) {
    return new Observer(value, ARRAY, options)
  } else if (_.isObject(value) && !value._scope) { // avoid Vue instance
    return new Observer(value, OBJECT, options)
  }
}

/**
 * Walk through each property, converting them and adding them as child.
 * This method should only be called when value type is Object.
 *
 * @param {Object} obj
 */

p.walk = function (obj) {
  var key, val
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      val = obj[key]
      this.observe(key, val)
      this.convert(key, val)
    }
  }
}

/**
 * Link a list of Array items to the observer.
 *
 * @param {Array} items
 */

p.link = function (items, index) {
  index = index || 0
  for (var i = 0, l = items.length; i < l; i++) {
    this.observe(i + index, items[i])
  }
}

/**
 * Unlink a list of Array items from the observer.
 *
 * @param {Array} items
 */

p.unlink = function (items) {
  for (var i = 0, l = items.length; i < l; i++) {
    this.unobserve(items[i])
  }
}

/**
 * If a property is observable,
 * create an Observer for it, and register self as
 * one of its parents with the associated property key.
 *
 * @param {String} key
 * @param {*} val
 */

p.observe = function (key, val) {
  var ob = Observer.create(val)
  if (ob) {
    // register self as a parent of the child observer.
    if (ob.findParent(this) > -1) return
    (ob.parents || (ob.parents = [])).push({
      ob: this,
      key: key
    })
  }
}

/**
 * Unobserve a property, removing self from
 * its observer's parent list.
 *
 * @param {*} val
 */

p.unobserve = function (val) {
  if (val && val.$observer) {
    val.$observer.findParent(this, true)
  }
}

/**
 * Convert a property into getter/setter so we can emit
 * the events when the property is accessed/changed.
 * Properties prefixed with `$` or `_` are ignored.
 *
 * @param {String} key
 * @param {*} val
 */

p.convert = function (key, val) {
  var prefix = key.charAt(0)
  if (prefix === '$' || prefix === '_') {
    return
  }
  var ob = this
  Object.defineProperty(this.value, key, {
    enumerable: true,
    configurable: true,
    get: function () {
      console.log('get', key)
      if (Observer.emitGet) {
        ob.notify('get', key)
      }
      return val
    },
    set: function (newVal) {
      if (newVal === val) return
      console.log('set', key, newVal)
      ob.unobserve(val)
      ob.observe(key, newVal)
      ob.notify('set', key, newVal)
      if (_.isArray(newVal)) {
        ob.notify('set',
                  key + Observer.pathDelimiter + 'length',
                  newVal.length)
      }
      val = newVal
    }
  })
}

/**
 * Emit event on self and recursively notify all parents.
 *
 * @param {String} event
 * @param {String} path
 * @param {*} val
 * @param {Object|undefined} mutation
 */

p.notify = function (event, path, val, mutation) {
  this.emit(event, path, val, mutation)
  if (!this.parents) return
  for (var i = 0, l = this.parents.length; i < l; i++) {
    var parent = this.parents[i]
    var ob = parent.ob
    var key = parent.key
    var parentPath = path
      ? key + Observer.pathDelimiter + path
      : key
    ob.notify(event, parentPath, val, mutation)
  }
}

/**
 * Update child elements' parent key,
 * should only be called when value type is Array.
 */

p.updateIndices = function () {
  var arr = this.value
  var i = arr.length
  var ob
  while (i--) {
    ob = arr[i] && arr[i].$observer
    if (ob) {
      var j = ob.findParent(this)
      ob.parents[j].key = i
    }
  }
}

/**
 * Find a parent option object
 *
 * @param {Observer} parent
 * @param {Boolean} [remove] - whether to remove the parent
 * @return {Number} - index of parent
 */

p.findParent = function (parent, remove) {
  var parents = this.parents
  if (!parents) return -1
  var i = parents.length
  while (i--) {
    var p = parents[i]
    if (p.ob === parent) {
      if (remove) parents.splice(i, 1)
      return i
    }
  }
  return -1
}

module.exports = Observer
},{"../emitter":7,"../util":13,"./array-augmentations":10,"./object-augmentations":11}],13:[function(_dereq_,module,exports){
/**
 * Mix properties into target object.
 *
 * @param {Object} to
 * @param {Object} from
 */

exports.mixin = function (to, from) {
  for (var key in from) {
    if (to[key] !== from[key]) {
      to[key] = from[key]
    }
  }
}

/**
 * Mixin including non-enumerables, and copy property descriptors.
 *
 * @param {Object} to
 * @param {Object} from
 */

exports.deepMixin = function (to, from) {
  Object.getOwnPropertyNames(from).forEach(function (key) {
    var descriptor = Object.getOwnPropertyDescriptor(from, key)
    Object.defineProperty(to, key, descriptor)
  })
}

/**
 * Proxy a property on one object to another.
 *
 * @param {Object} to
 * @param {Object} from
 * @param {String} key
 */

exports.proxy = function (to, from, key) {
  if (to.hasOwnProperty(key)) return
  Object.defineProperty(to, key, {
    enumerable: true,
    configurable: true,
    get: function () {
      return from[key]
    },
    set: function (val) {
      from[key] = val
    }
  })
}

/**
 * Object type check. Only returns true
 * for plain JavaScript objects.
 *
 * @param {*} obj
 * @return {Boolean}
 */

exports.isObject = function (obj) {
  return Object.prototype.toString.call(obj) === '[object Object]'
}

/**
 * Array type check.
 *
 * @param {*} obj
 * @return {Boolean}
 */

exports.isArray = function (obj) {
  return Array.isArray(obj)
}

/**
 * Define a non-enumerable property
 *
 * @param {Object} obj
 * @param {String} key
 * @param {*} val
 * @param {Boolean} [enumerable]
 */

exports.define = function (obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value        : val,
    enumerable   : !!enumerable,
    writable     : true,
    configurable : true
  })
}

/**
 * Augment an target Object or Array by either
 * intercepting the prototype chain using __proto__,
 * or copy over property descriptors
 *
 * @param {Object|Array} target
 * @param {Object} proto
 */

if ('__proto__' in {}) {
  exports.augment = function (target, proto) {
    target.__proto__ = proto
  }
} else {
  exports.augment = exports.deepMixin
}
},{}],14:[function(_dereq_,module,exports){
var _ = _dereq_('./util')

/**
 * The exposed Vue constructor.
 *
 * @constructor
 * @param {Object} [options]
 * @public
 */

function Vue (options) {
  this._init(options)
}

var p = Vue.prototype

/**
 * Mixin internal instance methods
 */

 _.mixin(p, _dereq_('./internal/init'))
 _.mixin(p, _dereq_('./internal/compile'))

/**
 * Mixin API instance methods
 */

_.mixin(p, _dereq_('./api/data'))
_.mixin(p, _dereq_('./api/dom'))
_.mixin(p, _dereq_('./api/events'))
_.mixin(p, _dereq_('./api/lifecycle'))

/**
 * Mixin global API
 */

_.mixin(Vue, _dereq_('./api/global'))

module.exports = Vue
},{"./api/data":1,"./api/dom":2,"./api/events":3,"./api/global":4,"./api/lifecycle":5,"./internal/compile":8,"./internal/init":9,"./util":13}]},{},[14])
(14)
});