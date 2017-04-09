/* 创建新图层
 *
 */
function createLayer (container, layersContainer, fakeImg, index) {
	const newLayer = document.createElement('canvas')
	newLayer.width = 600
	newLayer.height = 360
	newLayer.className = 'layer'
	newLayer.setAttribute('data-index', index)
	// 将新创建的图层加入到图层列表中，并且设置 z-index 值总是比之前的更大
	newLayer.style.zIndex = index
	// 放入页面上的容器中
	container.insertBefore(newLayer, container.firstElementChild)
	// container.appendChild(newLayer)

	// 并且在右侧图层面板新增节点表示新图层
	const layerPreview = document.createElement('div')
	layerPreview.className = 'layers__item'
	layerPreview.draggable = "true"
	// 创建一个临时容器
	const tempContainer = document.createDocumentFragment()
	// 左侧眼睛
	const control = document.createElement('div')
	control.className = 'layers__control layers__control--show'
	control.innerHTML = `<span style="display: inline-block;width: 10px">${index}</span><button class="layers__setshow" data-index=${index}>隐藏</button><button class="layers__setbg">设置背景色</button>`
	// control.$index = layers.length
	tempContainer.appendChild(control)
	// 右侧缩略图
	const preview = fakeImg.cloneNode(true)
	preview.getContext('2d').drawImage(fakeImg, 0, 0)
	preview.className = 'layers__preview'
	tempContainer.appendChild(preview)
	layerPreview.appendChild(tempContainer)
	layersContainer.insertBefore(layerPreview, layersContainer.firstElementChild)

	return newLayer
}
/* 创建一个只有背景的 canvas
 */
function createBackgroundCanvas () {
	const canvas = document.createElement('canvas')
	canvas.width = 50
	canvas.height = 50
	fillbackground(canvas.getContext('2d'), 5, '#eee')

	return canvas
}
/* 给指定画布绘制背景
 * @param <CanvasRenderingContext2D> ctx
 * @param <Number> size
 * @param <String> color
 */
function fillbackground (ctx, size, color='#eee') {
	ctx.fillStyle = color
	if (!size) {
		ctx.fillRect(0, 0, 600, 360)
		return
	}
	// 数量，向上取整
	let xNumber = Math.ceil(600 / size)
	let yNumber = Math.ceil(360 / size)
	let k = 0
	for (let i = 0; i < yNumber; i++) {
	    for (let j = 0; j < xNumber; j++) {
	        if ((k + i) % 2 === 0) {
                ctx.fillRect(j * size, i * size, size, size)
	        }
	        k++
	    }
	}
}
/* 移除类名
 * @param <String> className 全部类名
 * @param <String> target 要移除的类名
 */
function removeClassName (className, target) {
	return className.split(' ').filter(function (className) {
		return className !== target
	}).join(' ')
}
/* 判断某个坐标是否在指定容器内
 */
function isIn(targetContainerX, targetContainerY, targetWidth, targetHeight, position) {
    // 
    const endX = position.x
    const endY = position.y

    if(
    	endX > targetContainerX 
    	&& endX < targetContainerX + targetWidth
    	&& endY > targetContainerY 
    	&& endY < targetContainerY + targetHeight
    ) {
        return true
    }

    return false
}