/**
 * 一个仅用以创建空 Promise 的函数
 */
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
Promise.prototype.then = function (onFlufilled, onRejected) {
    // 创建了一个空 Promise 实例，因为在构造函数内有 判断 fn === noop
    var res = new Promise(noop);
    handle(this, new Handler(onFlufilled, onRejected, res));
}

function Handler(onFlufilled, onRejected, promise) {
    this.onFlufilled = onFlufilled;
    this.onRejected = onRejected;
    this.promise = promise;
}

// 重点在于 handle 函数？这里是把 new Handler 称作 deferred
function handle(self, deferred) {
    if (self._state === 0) {
        if (self._deferredState === 0) {
            self._deferredState = 1;
            self._deferreds = deferred;
            // 到这里就结束了代码的调用，等待异步代码执行完成
            return;
        }
    }
    handleResolve(self, deferred);
}

function handleResolve(self, deferred) {
    asap(function() {
        // deferred.onFlufilled 就是我们在 then 的第一个参数
        var cb = deferred.onFlufilled;
        var ret = tryCallOne(cb, self._value);
        resolve(deferred.promise, ret);
    });
}

function resolve(self, newValue) {
    self._state = 1;
    self._value = newValue;
    // 关键代码，不能缺少
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
 * 返回指定对象上的 then 方法
 * @param {Object} obj 要获取 then 方法的对象
 * @return {Function}
 */
function getThen(obj) {
    return obj.then;
}
