;(function () {
    var scripts = [].slice.call(document.getElementsByTagName('script'))
    for(var i = 0, len = scripts.length; i < len; i++) {
        var script = scripts[i]
        var dataMain = script.getAttribute('data-main')
        if (dataMain) {
            console.log('找到入口文件')
            // 将 data-main 作为第一个脚本文件载入
            load([dataMain])
            break
        }
    }
    // 载入脚本函数
    function load (ids) {
        // 根据 id 获取对应的 uri 地址以便载入 js 文件
        var originalUris = getUris(ids)
        // 遍历 ids 去 fetch
        for(var i = 0, len = originalUris.length; i < len; i++) {
            // 这个闭包有什么含义？
            (function (uri){
                fetch(uri)
            })(originalUris[i])
        }
    }
    /**
     * 根据 ids 返回对应的 uri 数组
     */
    function getUris (ids) {
        return ids.map(id => {
            return id + '.js'
        })
    }
    /**
     * 
     */
    function fetch (uri) {
        getScript(uri)
    }
    /**
     * 根据 uri 创建 script 标签
     */
    function getScript (uri) {
        var node = document.createElement('script')
        node.async = true 
        node.src = uri

        var head = document.getElementsByTagName('head')[0]
        head.insertBefore(node, head.firstChild)
    }
})()