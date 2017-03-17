document.body.onload = function () {
    // 当页面加载完成后
    var btn = document.getElementById('btn')
    btn.disabled = true
    var input = document.getElementById('date')
    var content = document.getElementById('content')
    var timer
    var globalValue

    var stopBtn = document.getElementById('stop')
    stopBtn.onclick = function () {
        timer && clearTimeout(timer)
    }

    /* @description 渲染指定内容到 content 节点中
     * @param <String> content */
    function renderContent(text) {
        content.innerHTML = text
    }
    /* @description检查输入的日期是否符合格式
     * @param <String> date
     * @return <Boolean> */
    function checkDate(date) {
        var dregexp = /([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]{1}|3[01])$)|((0[469]|11)-(0[1-9]|[12][0-9]|30)$)|(02-(0[1-9]|[1][0-9]|2[0-8])$))/
        if(dregexp.test(date)) {
            return true
        }
        return false
    }

    /* @description 计算与当前时间的时差
     * @param <Date> date 
     * @return <Number> 
     */
    function compareDate(date) {
        var now = new Date()
        var targetDate = new Date(date)
        if(now > targetDate) {
            // 如果输入时间小于当前时间，return 0
            return 0
        } else {
            return targetDate - now
        }
    }
    /* @description 将 YYYY-MM-DD 转换为 YYYY 年 MM 月 DD 日
     * @param <String> date
     * @return <String> */
    function convertDate(date) {
        var _ary = date.split('-')
        return _ary[0] + '年' + _ary[1] + '月' + _ary[2] + '日'
    }
    /* @description 将秒数转换为 xx天 xx 小时 xx 分 xx 秒
     * @param <Number> second
     * @return <String> */
    function convertSecond(second) {
        // 1 年 365 天，1 天 24 小时，1 小时 60 分钟，1分钟为 60 秒，1 秒 为 1000 毫秒
        // 分钟
        var minute = Math.floor(second/(60*1000))
        // 剩下的秒数
        second = Math.floor(second/1000 - minute*60)
        // 小时
        var hour = Math.floor(minute/60)
        minute = Math.floor(minute - hour*60)
        // 天
        var day = Math.floor(hour/24)
        hour = Math.floor(hour - day*24)
        // 年
        var year = Math.floor(day/365)
        day = Math.floor(day - year*365)
        return year + "年" + day + "天" + hour + "小时" + minute + "分钟" + second + "秒"
    }
    /* 
     * @description 按钮点击事件
     * @param <Object> event 
     */
    function handleClick (event) {
        // 获取到值
        var value = input.value
        if(value === globalValue) {
            // 
            return
        }
        clearTimeout(timer)
        globalValue = value
        timer = setInterval(function () {
            var compareResult = compareDate(value)
            // console.log(compareResult)
            if(compareResult === 0) {
                clearTimeout(timer)
            }
            var content = "距离" + convertDate(value) + '还有' + convertSecond(compareResult)
            renderContent(content)
        }, 1000)
    }
    /* @description 用户输入信息时触发的函数
     * @param: <Object> event */
    function handleInput(event) {
        // 拿到输入框内的值
        var value = event.target.value
        if(checkDate(value)) {
            // 检查返回 ture，表示符合要求
            btn.disabled = false
        } else {
            btn.disabled = true
        }
    }
    // 注册按钮点击事件
    btn.addEventListener('click', handleClick)
    // 注册输入框输入事件
    input.addEventListener('input', handleInput)
}
