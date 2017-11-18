# vue 源码阅读过程

## _init

调用`this._init`发生了什么？

主要来说，就是给`vm`添加了

- _uid
- _isVue = true
- $options = options
- _self = this

以及调用了`beforeCreated`钩子和`created`钩子。

![_init](./init.png)

### initLifecycle

在`_init`函数内调用了`initLifecycle`函数，从名字看是初始化生命周期？实际上就是给`vm`添加了很多的属性：

- $parent = options.parent
- $root = $parent.root || vm
- $children = []
- $refs = {}
- _watcher = null
- _inactive = null
- _directInactive = false
- _isMounted = false = false
- _isDestroyed = false
- _isBeingDestroyed = false

![initLifecycle](./initLifecycle.png)

### initEvent

顾名思义，初始化事件，主要就是将`_parentListeners`上的事件，注册到`vm`上？并将旧事件（如果有）就更新或者移除掉。

由于是使用`vm.$on`或者`vm.$once`添加事件，不过有个疑问就是为什么`vm`有这些方法，是在哪里添加的？

![initEvents](./initEvents.png)


### initRender

额，在这个函数内，做了非常多的事情，当然，最重要的就是我们熟知的设置`set`和`get`实现响应式，虽然只是给`$attrs`和`$listeners`设置，总体来说做了下面这些事情：

- vm._vnode = null
- vm.$solts = resolveSlots()
- vm.$scopedSlots = emptyObject
- vm._c = func
- vm.$createElement = func
- vm.$attrs
- vm.$listeners

![initRender](./initRender.png)

### initInjections

哦，完全不明白这个函数用来做什么，至今为止没有主动用到过`inject`这个配置项，到后面遇到的时候再回过头来看看吧。

![initInjections](./initInjections.png)


