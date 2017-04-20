# 0.11.0 版 vue 源码

定位版本为 [706c67d1d013577fdbfab258bca78557419cba7c](https://github.com/vuejs/vue/tree/706c67d1d013577fdbfab258bca78557419cba7c)

该版本只完成了`Observer`，即数据监听功能，能够监听对象与数组类型的值发生改变，还未实现渲染数据功能。

## 目录结构

### src

本次仿写全部源码。

### vue-source.js

该版本实际打包代码，即真正源码。

## 分析

核心文件为

- lib/Emitter.js
- observe/Observer

`Emitter.js`是事件分发器，`Observer`继承`Emitter`并和数据关联，对数据绑定事件分发器。

### 遍历

处理的流程为：

Observer.create() => new Observer() => this.walk() => this.observe() => Observer.create()..


这是一个循环，实现了对整棵树的遍历，在`Observer.create`内判断值是否要处理来中断该循环。

### 事件冒泡

`Observer`实例有`parents`属性，存放着该监听器的父级监听器，当自身改变，就取出父级监听器一一通知，实现事件冒泡。


### 数组方法拦截

数组可以使用数组方法如`push`改变数组，通过修改数组原型`observe/array-augmentations.js`实现对数组方法的拦截。
> 但是似乎并没有监听数组元素的改变，如`demo._scope.ary[0] = 'newVal'`并不会得知`0`发生了改变。
