# JavaScript作用域学习笔记

## 一切皆是对象

在一个函数被定义的时候，会将它**定义**时刻的`scope chain`连接到这个函数对象的`[[scope]]`属性。所以如果有下面代码执行：

```javascript
// 增加 [[scope]] 属性
var age = 24
var func = function (name) {
    var firstName = name

    return firstName + 'is ' + age
}

func('ltaoo') // ltaoo is 24
```

这里是定义了一个对象，所以在这个函数对象上就有了`[[scope]]`属性保存了`scope chain`。而这个函数在被调用的时候，会**创建**一个活动对象，函数的形参，都是该活动对象的属性，然后将这个活动对象作为此时的作用域链(scope chain)最前端，并将这个函数对象的`[[scope]]`加入到`scope chain`中。

> 因为`func`定义在全局环境，所以此时的`[[scope]]`只是指向全局活动对象`window active object`.



反过来思考，我在调用函数的时候，需要拿到一个变量，如何寻找？同样是上面的代码，在调用`func`函数时，`name`这个变量如何寻找，按照上面的说法，

```javascript
scope chain = [
    first: active object,
    second: active object
]
```

首先是在这个**作用域链**的第一个元素(一个活动对象)上查找有没有`name`属性。如果没找到就在第二个上面找，比如`age`就是在第二个上面找到的。


那重点就是这个活动对象了，


```javascript
var age = 24
var func = function (name) {
    var firstName = name
    return firstName + age
}
```
到这部分为止时的作用域链只有一个变量对象，就是全局变量对象，类似这样

```javascript
globalObject = {
    age: 24,
    func: function () {...},
    // 以及一些全局变量与方法，比如 console parseInt()
}
```

这个变量对象在作用域链的最顶端(因为只有一个)，在下面代码执行后，作用域链就发生了改变：

```javascript
func()
```

在调用函数后，作用域链应该是这样的：

```javascript
[scope chain] = [
    {
        name: 'ltaoo',
        firstName: 'ltaoo',
    },
    {
        age: 24,
        func: function () {...},
        // 以及一些全局变量与方法，比如 console parseInt()
    }
]
```

再来一个例子

```javascript
var name = "ltaoo"
function echo () {
    console.log(name)
}

function env() {
    var name = "eve"
    echo()
}

env()
```

如果按照上面的理论来逐步分析，作用域链是这样变化的：

```javascript
[scope chain] = [
    {
        name: 'ltaoo',
        echo: function () {...},
        env: function () {...},
        // 以及一些全局变量与方法，比如 console parseInt()
    }
]
```

调用`env()`后：

```javascript
[scope chain] = [
    {
        name: 'eve'
    },
    {
        name: 'ltaoo',
        echo: function () {...},
        env: function () {...},
        // 以及一些全局变量与方法，比如 console parseInt()
    }
]
```

再调用`echo()`

```javascript
[scope chain] = [
    {
        // 什么都没有
    },
    {
        name: 'eve'
    },
    {
        name: 'ltaoo',
        echo: function () {...},
        env: function () {...},
        // 以及一些全局变量与方法，比如 console parseInt()
    }
]
```

而在`echo`函数内要打印`name`，就是按照这个作用域链搜索了，结果应该是`eve`，但是实际是`ltaoo`，因为上面的分析过程是错误的。


应该是这样：










