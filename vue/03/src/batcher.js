/**
 * 用来维持一个任务队列
 * async on the next event loop.
 */

function Batcher() {
    this._preFlush = null
    this.reset()
}

var p = Batcher.prototype

/**
 * 向任务队列中添加一个任务
 * 有相同 id 的任务会被忽略，也可以使用参数 override 来覆盖已经存在的同样 id 的任务
 *
 * @param {Object} job
 *   properties:
 *   - {String|Number} id
 *   - {Boolean}       override
 *   - {Function}      run
 */

p.push = function(job) {
    // 如果 job 参数没有 id 并且？
    if (!job.id || !this.has[job.id]) {
        this.queue.push(job)
        this.has[job.id] = job
        if (!this.waiting) {
            this.waiting = true
            _.nextTick(this.flush, this)
        }
    } else if (job.override) {
        var oldJob = this.has[job.id]
        oldJob.cancelled = true
        this.queue.push(job)
        this.has[job.id] = job
    }
}

/**
 * Flush the queue and run the jobs.
 * Will call a preFlush hook if has one.
 */

p.flush = function() {
    // before flush hook
    if (this._preFlush) {
        this._preFlush()
    }
    // do not cache length because more jobs might be pushed
    // as we run existing jobs
    for (var i = 0; i < this.queue.length; i++) {
        var job = this.queue[i]
        if (!job.cancelled) {
            job.run()
        }
    }
    this.reset()
}

/**
 * 重置 batcher
 */

p.reset = function() {
    this.has = {}
    this.queue = []
    this.waiting = false
}
