# Promise 如何实现

Promise 还是很重要的，无论 yield 还是 async 都兼容该接口，重点了解下，promise 究竟是如何实现的。

## 基本使用

```javascript
const Promise = require('promise');

function fetch() {
    return new Promise((resolve, reject) => {
        if (Math.random() < 0.5) {
            resolve('success');
        } else {
            reject('fail');
        }
    });
}

fetch()
    .then(res => console.log(res))
    .catch(err => console.log(err));
```

可以看到，`Promise`是一个构造函数，通过`new`关键字实例化得到一个`promise`实例，该实例有`then`和`catch`方法，在实例化`promise`时传入的函数有两个参数`resolve`和`reject`。

所以先从构造函数的参数入手吧。

## 实现

### 入口

```javascript
// index.js
module.exports = require('./core.js');
```

### core.js

```javascript
function Promise(fn) {
    // 调用一个普通函数 doResolve ，并且传入函数与 promise 实例
    doResolve(fn, this);
}
```

#### doResolve()

```javascript
function doResolve(fn, promise) {
    var done = false;
    var res = tryCallTwo(fn, function (value) {
        if (done) return;
        done = true;
        resolve(promise, value);
    }, function (reason) {
        if (done) return;
        done = true;
        reject(promise, reason);
    });
    // 到这里
    if (!done && res === IS_ERROR) {
        done = true;
        reject(promise, LAST_ERROR);
    }
}
```

从正常函数调用来说，先调用了`tryCallTwo`，所以先看这个函数。

#### tryCallTwo()

很短的一个函数

```javascript
function tryCallTwo(fn, a) {
    try {
        return fn(a);
    } catch (ex) {
        LAST_ERROR = ex;
        return IS_ERROR;
    }
}

function tryCallTwo(fn, a, b) {
    try {
        fn(a, b);
    } catch (ex) {
        LAST_ERROR = ex;
        return IS_ERROR;
    }
}
```

在调用`tryCallTwo`函数后，会调用第一个参数并且将第二、第三个参数作为这次调用时的参数传入。所以在`doResolve`函数中，这段代码：

```javascript
var res = tryCallTwo(fn, function (value) {
    if (done) return;
    done = true;
    resolve(promise, value);
}, function (reason) {
    if (done) return;
    done = true;
    reject(promise, reason);
});
```

其实是

```javascript
fn(function (value) {}, function (reson) {});
```
`fn`就是我们在`new Promise`时传入的函数，先仿照这部分实现我们自己的`fakePromise`。

### then 方法

不过上面实在看不出什么，所以从`then`方法入手，因为我们知道调用了`then`方法后，内部如果`resolve`了就会调用`then`方法的参数。

```javascript
Promise.prototype.then = function (onFulfilled, onRejected) {
    var res = new Promise(noop);
    handle(this, new Handler(onFulfilled, onRejected, res));
    return res;
}
```

看起来很复杂，新出现了`noop`、`Handler`和`handle`三个变量。

### noop

```javascript
function noop() {}
```

就是这么简单，暂时先这样。

### Handler

```javascript
function Handler(onFulfilled, onRejected, promise) {
    this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
    this.onRejected = typeof onRejected === 'function' ? onRejected : null;
    this.promise = promise;
}
```

这个其实也挺简单的，就是用一个对象保存了`onFlufilled`、`onRejected`和`promise`而已。

### handle

```javascript
function handle(self, deferred) {
    while(self._state === 3) {
        self = self._value;
    }
}
```

### 目标

依然是从简单的`promise`实现，支持`then`方法，如下面代码：

```javascrit
function fetch() {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve('hello world');
        }, 2000);
    })
}

fetch.then(res => console.log(res));
```

目标就是能够打印出`hello world`，OK，开始实现。

### 如何实现










