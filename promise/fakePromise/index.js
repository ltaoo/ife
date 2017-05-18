function noop () {}
/**
 * 构造函数
 * 0 - pending
 * 1 - fulfilled with _value
 */
function Promise(fn) {
    // 初始化私有变量
    this._deferredState = 0; // 延迟状态
    this._state = 0; // 状态
    this._value = null; // 值
    if (fn === noop) return;
    doResolve(fn, this);
}
/**
 * flufill 满足
 * @param {Function} onFlufilled 满足条件时调用的函数
 * @param {Function} onRejected  不满足条件时调用的函数
 */
Promise.prototype.then = function (onFulfilled, onRejected) {
    const res = new Promise(noop);
    handle(this, new Handler(onFulfilled, onRejected, res));
    return res;
}
/**
 * Hanlder 顾名思义是处理器，当调用了 then 方法就有了处理器
 */
function Handler(onFulfilled, onRejected, promise) {
    this.onFulfilled = onFulfilled;
    this.onRejected = onRejected;
    this.promise = promise;
}

// 重点在于 handle 函数？这里是把 new Handler 称作 deferred
function handle(self, deferred) {
    if (self._state === 0) {
        if (self._deferredState === 0) {
            self._deferredState = 1;
            self._deferreds = deferred;
            // important! 到这里就结束了代码的调用，等待异步代码执行完成
            return;
        }
    }
    handleResolve(self, deferred);
}

function handleResolve(self, deferred) {
    var cb = self._state === 1 ? deferred.onFulfilled : deferred.onRejected;
    var ret = tryCallOne(cb, self._value);
    resolve(deferred.promise, ret);
}
/**
 *
 */
function resolve(self, newValue) {
    // 实现链式调用的代码
    if (
        newValue &&
        (typeof newValue === 'object' || typeof newValue === 'function')
    ) {
        var then = getThen(newValue);
        doResolve(then.bind(newValue), self);
        return;
    }
    self._state = 1;
    self._value = newValue;
    // 关键代码，不能缺少
    finale(self);
}
/**
 *
 */
function reject(self, newValue) {
    self._state = 2;
    self._value = newValue;
    finale(self);
}
/**
 * 结束？是哪里结束
 */
function finale(self) {
    if (self._deferredState === 1) {
        handle(self, self._deferreds);
        self._deferreds = null;
    }
}
/**
 * 执行 resolve ?
 * @param {Function} fn 就是在实例化 Promise 时传入的参数 function (resolve, reject) {..}
 * @param {Promise} promise 实例化 Promise 得到的实例
 */
function doResolve(fn, promise) {
    // 是否完成的标志
    var done = false;
    var res = tryCallTwo(
        fn, 
        // 当异步代码是 resolve 状态，就到了这里，value 即 resolve('xxx') 中的 value
        function (value) {
            if (done) return;
            done = true;
            resolve(promise, value);
        }, 
        function (reson) {
            if (done) return;
            done = true;
            reject(promise, reson);
        }
    );
}

function tryCallOne(fn, a) {
    return fn(a);
}
/**
 * 调用两个参数
 * @param {Function} 要调用的函数
 * @param {Any} a
 * @param {Any} b
 */
function tryCallTwo(fn, a, b) {
    fn(a, b);
}
/**
 * 返回指定对象的 then 方法
 */
function getThen(obj) {
    return obj.then;
}
