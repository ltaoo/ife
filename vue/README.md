# vue 源码阅读过程

## _init

调用`this._init`发生了什么？

主要来说，就是给`vm`添加了

- _uid
- _isVue
- $options
- _self

以及调用了`beforeCreated`钩子和`created`钩子。

![this._init](./init.png)
