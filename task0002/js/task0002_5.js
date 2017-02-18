document.body.onload = function () {
    var sourceList = document.querySelectorAll('#source .container__item')
    // 拿到目标容器
    var targetContainer = document.querySelector('#target')
    // 目标容器在屏幕上的坐标
    var targetContainerX = targetContainer.offsetLeft
    var targetContainerY = targetContainer.offsetTop

    // 定义一个全局变量用来标志是否进入了容器，默认 false
    var enterContainer = false

    /* sourceList.addEventListener('drag', function (event) {
     *     console.log(event.target.innerHTML)
     * }) */

    // 对每一个元素增加拖拽事件
    sourceList.forEach(function (item, index) {
        // 开始拖拽
        /* item.ondragstart = function (event) {
         *     var node = event.target
         *     node.style.cursor = 'move'
         * } */
        // 拖拽过程中
        item.ondrag = function (event) {
            // 移动过程中如果放手会放到容器中，就让容器边框高亮
            var x = event.clientX
            var y = event.clientY

            if(x === 0 || y === 0) {
                return
            }
            // console.log(event)
            // event.dataTransfer.effectAllowed = "copy";
            // 移动过程中的坐标
            // console.log(event.clientX, event.clientY)

            var node = event.target
            node.style.backgroundColor = '#fff'
            node.style.border = '2px dotted #ccc'


            // console.log(x, y)

            if(x > targetContainerX) {
                enterContainer = true
                targetContainer.style.border = '2px solid red'
            } else {
                enterContainer = false
                targetContainer.style.border = '1px solid #ccc'
            }
        }
        // 结束拖拽
        item.ondragend = function (event) {
            // console.log(event)
            var node = event.target
            node.style.backgroundColor = 'green'
            node.style.border = 'none'
            node.style.borderBottom = '1px solid #ccc'

            if(enterContainer) {
                targetContainer.appendChild(node)
            }
            node.style.cursor = 'pointer'
            targetContainer.style.border = '1px solid #ccc'
        }
    })

    /* targetContainer.ondragenter = function (event) {
     *     enterContainer = true
     * }
     * targetContainer.ondragleave = function (event) {
     *     enterContainer = false
     * } */

    // 判断某个元素是否在容器中
    function isIn(targetContainer, position) {
        var endX = position.x
        var endY = position.y

        if(endX > targetContainerX) {
            return true
        }

        return false
    }
}
