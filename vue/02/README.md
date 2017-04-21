# 0.11.0 版 vue 源码

此次的版本为：[b1654d5e024b523650c60df8f4c8e89f59d47b63](https://github.com/vuejs/vue/tree/b1654d5e024b523650c60df8f4c8e89f59d47b63)

该版源码实现数据渲染，通过传入`el`能够渲染`data`对应的数据，删除了和数据渲染无关的部分代码，比如注册事件、双向绑定（下一次分析）等，都是为了能够将精力聚焦在如何实现将数据渲染至页面。

## 分析

### internal/init.js -> instance/init.js

将`_init()`拆分为多个函数，每个函数负责不同的功能。

先将之前的代码按照新的源码也拆分为多个函数，基本没有太大变化。

### api/lifecycle.js

在`_init`函数内，最后，如果传了`el`值，就调用`$mount`函数。

```javascript
function $mount (el) {
    // 调用生命周期钩子
    this._callHook('beforeMount')
    // 初始化节点
    this._initElement(el)
    // 编译
    this._compile()
    // 调用生命周期钩子
    this._callHook('ready')
}
```

先调用生命周期钩子，再进行后续操作，这里暂时将钩子函数注释掉。

### instance/element.js

主要就是初始化了`this.$el`变量，如果`options`有`template`属性就进行处理，总而言之就是初始化页面`DOM`，可以暂时这么理解。

### instance/compile.js

重点，将处理好的页面`DOM`进行解析，分`Element`和`TextNode`分别进行处理，如果是`Element`就拿到属性，看看有没有指令，如果是`TextNode`就解析这段文本，主要是将`{{}}`作为一个`v-text`指令来处理。

无论是属性指令还是文本插值，最后都是要实例化指令。

### directive.js

从实例化时传的参数，也能够大概了解一个指令实例是做什么用的了：

```javascript
new Directive(name, node, this, descriptors[i])
```

- `name`是指令名，通过指令名才能知道该指令是用来做什么的，比如`text`就是用来渲染文本的。
- `node`是指令对应的节点，这样才能够知道把内容渲染到哪里。
- `this`就是`vue`实例，用来传入`new Watcher()`，也只有从这个参数里，才能够拿到`data`，不然从哪里拿呢？
- `descriptors[i]`，这个就是指令的值了，比如`{{name}}`就能够拿到`name`，使用这个从`data`里面拿到真正的值，放到`node`中实现渲染。

### watcher.js

观察者，借助该实例化对象从`vm`中获取到值并返回。




