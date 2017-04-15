;(function () {
    var scripts = [].slice.call(document.getElementsByTagName('script'))
    for(var i = 0, len = scripts.length; i < len; i++) {
        var script = scripts[i]
        var dataMain = script.getAttribute('data-main')
        if (dataMain) {
            // load([dataMain])
            console.log('找到入口文件')
        }
    }
})()