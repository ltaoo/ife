function init () {
    var input = document.querySelector('#search_input')
    var select = document.querySelector('#search_select')
    var btn = document.querySelector('#search_btn')
    btn.onclick = function () {
        btn.disable = true
        btn.innerText = '正在查询'
        const keywork = input.value
        if (!keywork) {
            alert('请输入查询关键字')
            return
        }
        const device = select.value
        fetch(`search?keyword=${keywork}&device=${device}`)
            .then(res => {
                return res.json()
            })
            .then(json => {
                console.log(json)
                btn.disable = false
                btn.innerText = '点击搜索'
            })
            .catch(err => {
                console.log(err)
            })
    }
}

init()