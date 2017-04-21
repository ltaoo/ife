# 0.11.0 版 vue 源码

b1654d5e024b523650c60df8f4c8e89f59d47b63

该次源码实现数据渲染，通过传入`el`能够渲染`data`数据。

## 分析

### internal/init.js -> instance/init.js

将`_init()`拆分为多个函数，每个函数负责不同的功能。

先将之前的代码按照新的源码也拆分为多个函数，以仍能够实现监听数据变化为目标。

### bindings.js

新增 Binding 类

### api/lifecycle.js

在`_init`函数内，最后，如果传了`el`值，就调用`$mount`。

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

先调用生命周期钩子，再进行后续操作。`instance/events.js`。

#### instance/element.js

```javascript
function _initElement (el) {
    if (typeof el === 'string') {
        el = document.querySelector(el)
        // 错误提示
        if (!el) console.log('没有找到该节点')
    }
    this.$el = el
    // 初始化模板
    this._initTemplate()
    // 初始化内容
    this._initContent()
}
```

#### instance/compile.js




