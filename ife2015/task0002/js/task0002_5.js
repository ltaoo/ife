document.body.onload = function () {
    var sourceList = document.querySelectorAll('#source .container__item')
    // 拿到目标容器
    var targetContainer = document.querySelector('#target')
    // 定义一个变量用来保存在目标容器内已经有多少个 item
    var targetList = []
    // 目标容器在屏幕上的坐标
    var targetContainerX = targetContainer.offsetLeft
    var targetContainerY = targetContainer.offsetTop
    // 拿到 item 的宽高
    var cell = document.querySelector('#source .container__item')
    var cellWidth = cell.clientWidth
    var cellHeight = cell.clientHeight

    // 定义一个全局变量用来标志是否进入了容器，默认 false
    var enterContainer = false
    // 定义一个全局变量用来标志应该插入到哪个位置
    var _index = 0

    var virtualNode

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

            // 疯狂计算位置
            if(enterContainer) {
                // 如果进入了容器，必定会有这个虚拟节点
                // 一个在目标容器内的虚拟节点用来预知位置
                if(!virtualNode) {
                    virtualNode = document.createElement('li')
                    virtualNode.className = 'container__item--virtual'
                }
                // 还应该加上 targetContaner 的 top 值
                if(y >= targetList.length*cellHeight) {
                    targetContainer.appendChild(virtualNode)
                }
                else {
                    // 计算出现在鼠标应该是在哪个位置
                    var index = Math.floor(y/cellHeight)
                    targetContainer.insertBefore(virtualNode, (targetContainer.children)[index])
                }
            } else {
                if(virtualNode) {
                    targetContainer.removeChild(virtualNode)
                }
                virtualNode = null
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
                // targetContainer.appendChild(node)
                targetContainer.replaceChild(node, virtualNode)
                targetList.push(node)
                // 移除虚拟节点
                /* if(virtualNode) { */
                    // targetContainer.removeChild(virtualNode)
                /* } */
                virtualNode = null
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
