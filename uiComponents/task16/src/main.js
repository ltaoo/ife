function init () {
	const canvas = document.querySelector('#canvas')
	// 右侧图层容器
	const layersContainer = document.querySelector('#layers')
	// 图层数组
	let layers = []
	// 创建一个仅仅用来作为预览的 canvas
	const fakeImg = createBackgroundCanvas()
	// 监听绘制操作
	let drawable = false
	let pressX = 0
	let pressY = 0
	let color = '#000'
	const colorEle = document.querySelector('#color')
	canvas.onmousedown = event => {
		canvas.style.cursor = 'pointer'
		pressX = event.layerX
		pressY = event.layerY
		drawable = true

		color = colorEle.value
	}
	// 移动操作，newLayer 是绘画区域重叠的每一个 canvas
	let newLayer = null
	canvas.onmousemove = event => {
		if (!drawable) {
			return
		}
		// 如果新图层不存在，则创建它
		if (!newLayer) {
			newLayer = createLayer(canvas, layersContainer, fakeImg, layers.length)
			layers.unshift(newLayer)
		}
		// 模拟画笔移动
		const ctx = newLayer.getContext('2d')
		ctx.fillStyle = color
		ctx.strokeStyle = color
		// 初始位置
		ctx.beginPath()
		ctx.moveTo(pressX, pressY)
		ctx.lineTo(event.layerX, event.layerY)
		ctx.stroke()
		pressX = event.layerX
		pressY = event.layerY
	}
	canvas.onmouseup = event => {
		canvas.style.cursor = 'default'
		newLayer = null
		drawable = false
	}
	// 右侧图层列表操作
	layersContainer.onclick = event => {
		const target = event.target
		// 点击按钮控制图层显隐
		if (target.className === 'layers__setshow') {
			const index = Array.from(layersContainer.children).indexOf(target.parentElement.parentElement)
			// 如果点击按钮时文本是 隐藏，则表示要隐藏该图层
			if (target.innerText === '隐藏') {
				target.innerText = '展示'
				canvas.children[index].style.display = 'none'
			} else {
				target.innerText = '隐藏'
				canvas.children[index].style.display = 'initial'
			}
		} else if (target.className = 'layers__setbg') {
			const index = Array.from(layersContainer.children).indexOf(target.parentElement.parentElement)
			// 拿到对应的 ctx
			const ctx = canvas.children[index].getContext('2d')
			fillbackground(ctx, null, colorEle.value)
		}
	}
	// 处理改变图层顺序
	let isInContainer = false
	let nodeIndex = null
	let index = 0
	// 目标容器在屏幕上的坐标用来定位鼠标是否在该容器内
    const targetContainerX = layersContainer.offsetLeft
    const targetContainerY = layersContainer.offsetTop
    const targetWidth  = layersContainer.clientWidth
    const targetHeight = layersContainer.clientHeight
	const sourceContainer = layersContainer

	// 保存拖拽过程中的 x 和 y 值，因为结束拖放后 x y 值不一致了
	let x = 0
	let y = 0
	sourceContainer.ondrag = event => {
		const node = event.target
		if (node.className.indexOf('drag') === -1) {
			node.className += ' layers__item--drag'
		}
		if (!nodeIndex) {
            nodeIndex = Array.from(sourceContainer.children).indexOf(node)
		}
		if (event.pageX !== 0 && event.pageY !== 0) {
			x = event.pageX
			y = event.pageY
		}

		// 计算位置，给出结束拖放后可能的放置位置
		if (isIn(targetContainerX, targetContainerY, targetWidth, targetHeight, {
			x,
			y
		})) {
			// 
			isInContainer = true
			sourceContainer.style.border = '1px solid red'
		} else {
			isInContainer = false
			sourceContainer.style.border = '1px solid #666'
		}
		let virtualNode = null
		let hasRemove = false
		console.log(x, y, isInContainer)
		// 疯狂计算位置
        if(isInContainer) {
            // 如果进入了容器，必定会有这个虚拟节点
            // 一个在目标容器内的虚拟节点用来预知位置
            // if(!virtualNode) {
            //     virtualNode = document.createElement('div')
            //     virtualNode.className = 'layers__item--virtual'
            // }
        	node.style.display = 'flex'
        	let number = layers.length
                // 计算出现在鼠标应该是在哪个位置
                index = Math.floor(y / 50)
                if (index > sourceContainer.children.length) {
                	index = sourceContainer.children.length
                }
                sourceContainer.insertBefore(node, sourceContainer.children[index])
        } else {
        	// 如果不在容器内，表示要删除该节点	
        	node.style.display = 'none'
        }
	}
	sourceContainer.ondragend = event => {
		const node = event.target
		node.className = removeClassName(node.className, 'layers__item--drag')
		// 如果结束拖放后，拖放元素存在容器内，就是要改变顺序
		if (isInContainer) {
			node.style.display = 'flex'
			// 改变图层顺序
			sourceContainer.insertBefore(node, sourceContainer.children[index])
            canvas.insertBefore(canvas.children[nodeIndex], canvas.children[index])
            // 改变 z-index 值

            for(let i = 0, len = canvas.children.length; i < len; i++) {
                const layer = canvas.children[i]
            	const zIndex = Math.abs(i - canvas.children.length)
            	// console.log(i, zIndex - 1)
                layer.style.zIndex = zIndex - 1
            }
        // 如果不存在容器中，就是要移除图层
		} else {
			// 先计算出 index
			const index = Array.from(sourceContainer.children).indexOf(node)
			canvas.removeChild(canvas.children[index])
			// 同时还要移除左侧的图层
			sourceContainer.removeChild(node)
		}
		
		nodeIndex = null
		sourceContainer.style.border = '1px solid #666'


	}
}