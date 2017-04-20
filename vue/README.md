# 0.11.0 版 vue 源码

b1654d5e024b523650c60df8f4c8e89f59d47b63

该次源码实现数据渲染，通过传入`el`能够渲染`data`数据。

## 分析

### internal/init.js -> instance/init.js

将`_init()`拆分为多个函数，每个函数负责不同的功能。

先将之前的代码按照新的源码也拆分为多个函数，以仍能够实现监听数据变化为目标。

### bindings.js

新增 Binding 类
