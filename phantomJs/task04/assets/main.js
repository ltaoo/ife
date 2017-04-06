function init () {
    const input = document.querySelector('#search_input')
    const select = document.querySelector('#search_select')
    const btn = document.querySelector('#search_btn')
    const table = document.querySelector('#search_content')
    let disable = false
    btn.onclick = function () {
        btn.innerText = '正在查询'
        if (disable) {
            return
        }
        const keywork = input.value
        if (!keywork) {
            alert('请输入查询关键字')
            return
        }
        const device = select.value
        disable = true
        fetch(`search?keyword=${keywork}&device=${device}`)
            .then(res => {
                return res.json()
            })
            .then(json => {
                console.log(json)
                disable = false
                btn.innerText = '点击搜索'
                // 渲染至页面
                updateTable(table, json.dataList)
            })
            .catch(err => {
                console.log(err)
            })
    }
}
/* 使用指定数据更新指定表格
 * @param <Element> table
 * @param <Array> data
 */
function updateTable (table, data) {
    let innerHtml = ''
    for(let i = 0, len = data.length; i < len; i++) {
        let item = data[i]
        innerHtml += `<tr><td><a href="${item.link}">${item.title}</a></td><td>${item.info}</td>`
        // 处理是否有图片
        innerHtml += item.localImg ? `<td><img src="${item.localImg}"></td></tr>` : '</tr>'
    }

    const tbody = table.querySelector('tbody')
    tbody.innerHTML = innerHtml
}

init()