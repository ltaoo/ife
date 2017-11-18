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

### initState

终于到了我们最熟悉的地方，在`initState`函数内，会对`props`、`methods`、`data`、`computed`以及`watch`进行处理，对，就是我们在日常中最常用到的这些，都在`initState`函数内看到了，泪奔啊。

由于代码量太多，所以又拆开来分析。
![initState](./initState.png)

#### initProps

初始化`props`，虽然听起来很简单，但实际上也是做了很多事情，先对`props`做验证，然后是返回值（如果传入了就用传入的，否则就用默认的）。

- vm._props = {}
- vm.$options._propKeys = []

![initProps](./initProps.png)

#### initMethods

这是最简单的函数了，在开发环境会做一些错误提示，比如该方法值是`null`，或者已经是一个`props`之类的，在生产环境就直接会将该方法放到`vm`上，如果是`null`就变成一个空函数。

![initMethods](./initMethods.png)

#### initData

其实在`initData`内并没有做什么，主要还是一些重新属性的错误提示，最主要的工作还是由`observe`来做的，在很多地方出现了这个函数，所以肯定是要独立来分析的。

![initData](./initData.png)

#### initComputed

很复杂，虽然在看之前就已经预料到会很复杂。

主要做了两件事，1、给每个`key`实例化了一个`Watcher`并保存；2、在`vm`上添加了`computed`同名的`key`，并且在获取值时会调用之前实例化的`watcher`上的方法。

但，为什么函数体内的值发生变化的时候，会触发到自身调用呢？

- vm._computedWatchers  保存了很多个 Watcher 实例，用在获取值的时候

![initComputed](./initComputed.png)

#### initWatch

初始化监听，很简单，遍历`watch`并给每个键调用`createWatcher`，而在`createWatcher`中其实就是调用了`vm.$watch`，而在`vm.$watch`中，其实最终还是实例化`Watcher`。

![initWatch](./initWatch.png)

### initProvide

只是添加了`vm._provide`这一个属性。

![initProvide](./initProvide.png)

## $mount


OK，前面终于完成了初始化，到目前为止都是平台无关的，接下来就和运行的平台有关了，所以是分为了`web`与`weex`两个不同的`$mount`实现，当然这里只会分析`web`端的实现，这部分的入口在`vue/platforms/web/entry-runtime-with-compiler.js"。

开始吧！

在这个函数内，主要是对`el`、`template`做处理，需要将这两个转换为`render`函数，当然如果已经有`render`函数，会忽略上面两个。

由于存在“编译”，所以还是很复杂，主要逻辑在`compileToFunctions`函数内。

![mount](./mount.png)

### compile

额，先来说说`compile`，因为`compileToFunctions`是调用`createCompileToFunctionsFn`时传入`compile`得到的。

![compile](./compile.png)

### createCompileToFunctionFn

其实就是返回了`compileToFunctions`这个函数，额外的处理就是多了`cache`闭包，能够缓存一些重复的编译工作？

重点还是`compileToFunctions`函数：

#### compileToFunctions

调用了传进来的`compile`，就是上面那个函数得到了`compiled`变量，再调用`createFunction`并传入了`compile.render`就得到了`render`函数。

![createCompileToFunctionsFn](./createCompileToFunctionsFn.png)


