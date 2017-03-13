// 尝试自己实现一个事件监听发布机制
function Emitter () {
	this.events = {}
	return this
}

/* 事件监听函数
 * @param <String> event 要监听的事件名
 * @param <Function> fn  事件触发时要调用的函数
 */
Emitter.prototype.on = function (event, fn) {
	// 由于支持注册同名事件，所以事件对应的函数肯定是数组
	var fns = this.events[event] || []
	fns.push(fn)
	this.events[event] = fns
}

/* 事件触发函数
 * @param <String> event 要触发的事件名
 */
Emitter.prototype.emit = function (event, a, b, c) {
	var fns = this.events[event]

	if (fns) {
		fns.forEach(fn => {
			fn.call(null, a, b, c)
		})
	}
}

/* 取消指定事件监听
 * @param <String> event
 * @param:options <Function> fn
 */
Emitter.prototype.off = function (event, fn) {
	// 首先判断该事件是否存在
	var fns = this.events[event]
	// if ([]) true or false ? answer is true
	if (!fns || fns.length === 0) {
		console.log('没有注册该事件')
		return
	}
	// 如果没有传 fn ，就取消该事件所有的函数，否则只取消这一个
	if (fn) {
		var index = fns.indexOf(fn)
		fns.splice(index, 1)
	} else {
		fns = []
	}

	this.events[event] = fns
}