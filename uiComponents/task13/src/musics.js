;(function (window) {
    /**************
       渲染音乐列表
     *************/
    function renderMusics (container, ary) {
        const fragment = document.createDocumentFragment()
        const list = []
        ary.forEach(music => {
            let li = document.createElement('li')
            list.push(li)
            li.className = 'musics__item'
            li.innerHTML = `<p>${music.songname}</p>`
            fragment.appendChild(li)
        })
        container.appendChild(fragment)
        return list
    }
    window.renderMusics = renderMusics
})(window)