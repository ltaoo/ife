/* 车辆类
 * @options Object 配置参数，车辆长宽高
 */
function Car(options) {
    const renderer = options.renderer
    const scene = options.scene
    const camera = options.camera
    // 创建车辆
    const carTexture = THREE.ImageUtils.loadTexture('./wood.jpg', {}, function () {
        renderer.render(scene, camera)
    })
    // 车辆长度，指 x 轴
    const length = this.length = options.length || 6
    // 车辆高度，指 y 轴
    const height = this.height = options.height || 2
    // 车辆宽度，指 y 轴
    const width = this.width = options.width || 2
    const car = new THREE.Mesh(new THREE.CubeGeometry(length, width, height),
        new THREE.MeshPhongMaterial({
            map: carTexture
        }) 
    )
    car.castShadow = true
    car.receiveShadow = true
    // 轮胎配置，比如贴图、半径、宽度
    const wheelOptions = {
        renderer,
        scene,
        camera
    }
    // 左前轮
    const leftHeadWheel = this.leftHeadWheel = new Wheel(wheelOptions)
    leftHeadWheel.position.set(length/2, -height/2, -width/2)
    scene.add(leftHeadWheel)
    // 右前轮
    const rightHeadWheel = this.rightHeadWheel = new Wheel(wheelOptions)
    rightHeadWheel.position.set(length/2, -height/2, width/2)
    scene.add(rightHeadWheel)
    // 左后轮
    const leftAfterWheel = this.leftAfterWheel = new Wheel(wheelOptions)
    leftAfterWheel.position.set(-length/2, -height/2, -width/2)
    scene.add(leftAfterWheel)
    // 右后轮
    const rightAfterWheel = this.rightAfterWheel = new Wheel(wheelOptions)
    rightAfterWheel.position.set(-length/2, -height/2, width/2)
    scene.add(rightAfterWheel)

    scene.add(car)
    this.cube = car
    return this
}
// 车辆驾驶
Car.prototype.drive = function (direction, instance) {
}
// 车辆转弯
Car.prototype.wheel = function (rotation) {
    console.log('rotation')
    this.cube.rotation.set(0, rotation, 0)
    // 左前轮
    this.leftHeadWheel.rotation.set(0, rotation, 0)
    this.leftHeadWheel.position.x = Math.cos(rotation)*2
    this.leftHeadWheel.position.z = Math.sin(rotation)*2
    console.log(this.leftHeadWheel.position)
    // 右前轮
    this.rightHeadWheel.rotation.set(0, rotation, 0)
    this.rightHeadWheel.position.x = Math.cos(rotation)*2
    this.rightHeadWheel.position.z = -Math.sin(rotation)*2
    console.log(this.rightHeadWheel.position)
    // 左后轮
    this.leftAfterWheel.rotation.set(0, rotation, 0)
    this.leftAfterWheel.position.x = -Math.cos(rotation)*2
    this.leftAfterWheel.position.z = Math.sin(rotation)*2
    console.log(this.leftAfterWheel.position)
    // 右后轮
    this.rightAfterWheel.rotation.set(0, rotation, 0)
    this.rightAfterWheel.position.x = -Math.cos(rotation)*2
    this.rightAfterWheel.position.z = -Math.sin(rotation)*2
    console.log(this.rightAfterWheel.position)
}
/* 轮胎类 */
function Wheel(options) {
    const renderer = options.renderer
    const scene = options.scene
    const camera = options.camera
    // 创建材质
    const texture = THREE.ImageUtils.loadTexture('./timg.jpeg', {}, function () {
        renderer.render(scene, camera)
    })
    const wheelMaterial = new THREE.MeshLambertMaterial({
        color: 0xffffff,
        map: texture
    })
    return new THREE.Mesh(new THREE.TorusGeometry(.6, .3, 20, 20), wheelMaterial)
}

document.body.onload = function () {
    if(!Detector.webgl) Detector.addGetWebGLMessage()
    // 1、创建 renderer，可以理解为一个画布
    var renderer = new THREE.WebGLRenderer({
        canvas: document.querySelector('#main')
    })
    // 告诉渲染器渲染阴影
    renderer.shadowMap.enabled = true
    renderer.shadowMap.soft = true
    // 设置画布的颜色
    renderer.setClearColor(0xffffff)
    // 2、创建场景
    var scene = new THREE.Scene()
    /* 3、创建照相机，该照相机为 "透视投影照相机"
     * THREE.PerspectiveCamera(fov, aspect, near, far)
     * @param fov:     视景体竖直方向上的张角，张角越大物体越小
     * @param aspect:  width/height，是照相机水平方向和竖直方向长度的比值，通常和画布的比例一致
     * @param near:    照相机到视景体最近的具体
     * @param far:     照相机到视景体最远的具体，且必须大于 near
     */
    var camera = new THREE.PerspectiveCamera(45, 4/3, 1, 1000)
    // 三视图之 侧视图
    // camera.position.set(10, 0, 0)
    // 三视图之 顶视图
    // camera.position.set(0, 10, 0)
    // 三视图之 主视图
    // camera.position.set(0, 0, 10)
    // 4、设置照相机将要放置的位置
    // camera.position.set(6, 4, 6)
    camera.position.set(6, 4, 6)
    camera.lookAt(new THREE.Vector3(0, 0, 0))
    /* ===========================================
     *    任务四增加的部分
     ===========================================*/
    // 创建好照相机后，创建控制器来控制照相机
    var controls = new THREE.TrackballControls(camera, document.querySelector('#main'))
    // 设置旋转、缩放和 ？ 的速率
    controls.rotateSpeed = 1.0
    controls.zoomSpeed = 1.2
    controls.panSpeed = 0.8

    controls.noZoom = false
    controls.noPan = false

    controls.staticMoving = true
    controls.dynamicDampingFactor = 0.3

    controls.keys = [65, 83, 68]
    // 重点在这里，当触发 controls 的 change 事件时，调用 render
    controls.addEventListener('change', render)
    /* ============================
     * 结束
     =============================*/
    const car = new Car({
        length: 2,
        width: 2,
        height: 2,
        renderer,
        scene,
        camera
    })
    // 创建一个小球
    var ballRadius = 0.2
    var ball = new THREE.Mesh(new THREE.SphereGeometry(ballRadius, 10, 10),
        new THREE.MeshLambertMaterial({
            color: 0xff0000
        })
    )
    ball.position.set(0, 3, 0)
    ball.castShadow = true
    scene.add(ball)
    // 添加平面作为地面
    var floorTexture = THREE.ImageUtils.loadTexture('./floor.jpeg', {}, function () {
        renderer.render(scene, camera)
    })
    var floor = new THREE.Mesh(new THREE.PlaneGeometry(20, 20, 16, 16),
        new THREE.MeshLambertMaterial({
            // color: 0xcccccc,
            map: floorTexture
            // wireframe: true
        })
    )
    // 初始化的平面是 x 轴与 y 轴构成的面，需要通过旋转变成 x 轴与 z 轴的面
    floor.position.y = -2
    floor.rotation.set(- Math.PI / 2, 0, 0)
    // 表示平面会接收阴影
    floor.receiveShadow = true
    scene.add(floor)
    /* ===========================
     *        添加光源
     *===========================*/
    // var light = new THREE.DirectionalLight()
    var light = new THREE.SpotLight(0xffffff, 1, 100, Math.PI/6, 25)
    light.position.set(2, 5, 3)
    light.target = car.cube
    light.castShadow = true

    light.shadow.camera.near = 1
    light.shadow.camera.far = 100
    light.shadow.camera.visible = true
    light.shadow.mapSize.Width = 1024
    light.shadow.mapSize.Height = 1024
    scene.add(light)

    var directionLight = new THREE.DirectionalLight()
    directionLight.position.set(2, 5, 3)
    scene.add(directionLight)
    var ambientLight = new THREE.AmbientLight(0xffffff)
    // scene.add(ambientLight)
    // 7、最后在画布上显示
    renderer.render(scene, camera)

    // 小球速度
    // var v = -0.08
    var v = 0
    // 小球加速度
    var a = -0.01
    // 小球是否在运动
    var isMoving = true
    // 最大高度，每次都会减小
    var maxHeight = ball.position.y
    // 假设小球有一个能量值，能量值为 0 就不再运动
    var nengli = 100

    drop()

    function drop() {
        if(isMoving) {
            // 如果小球仍然在运动
            ball.position.y += v
            v = parseFloat((a + v).toFixed(2))

            if(ball.position.y <= 1+ballRadius) {
                // 表示碰到了地板
                v = parseFloat((-v * 0.9).toFixed(2))
                // maxHeight -= 0.05
                nengli -= 10
            }
            // if(ball.position.y > maxHeight) {
                // v = parseFloat((-v * 0.9).toFixed(2))
                // maxHeight -= 0.05
            // }

            console.log(v > 0 ? '往上运动' : '往下运动', v)

            // if(Math.abs(v) < 0.01) {
                // 停止运动
                // isMoving = false
                // ball.position.y = 1+ballRadius
            // }
            if(nengli <= 0) {
                isMoving = false
                ball.position.y = 1+ballRadius
            }
        }

        renderer.render(scene, camera)
        // id = requestAnimationFrame(drop)
    }

    /* ============================
     * 任务四增加的部分
     =============================*/
    animate()

    function animate() {
        requestAnimationFrame(animate)
        controls.update()
    }
    // 调用该函数将重新渲染一次
    function render() {
        renderer.render(scene, camera)
    }
    /* ============================
     * 结束
     =============================*/
    /* ============================
     * 任务五增加的部分
     =============================*/

    var directionX = 1
    var directionZ = 0
    function _move(x, z) {
        // 根据 direction 计算移动的距离
        car.position.x += x
        leftHeadWheel.position.x += x
        rightHeadWheel.position.x += x
        leftAfterWheel.position.x += x
        rightAfterWheel.position.x += x
        car.position.z += z
        leftHeadWheel.position.z += z
        rightHeadWheel.position.z += z
        leftAfterWheel.position.z += z
        rightAfterWheel.position.z += z
        rightHeadWheel.rotation.z -= 
        leftHeadWheel.rotation.z += Math.PI/8
        rightHeadWheel.rotation.z += Math.PI/8
        leftAfterWheel.rotation.z += Math.PI/8
        rightAfterWheel.rotation.z += Math.PI/8
    }
    function _rotation(y) {
    }
    function move(event) {
        console.log('press')
        // 先实现能够往一个方向移动
        // console.log(event)
        if(event.key === 'w') {
            // 前进
            _move(0.1*directionX, directionZ*0.1)
            if(car.rotation.y !== rightHeadWheel.rotation.y) {
                car.rotation.y = rightHeadWheel.rotation.y
            }
        } else if(event.key === 's') {
            // 后退
            _move(-0.1*directionX, directionZ*-0.1)
        } else if(event.key === 'a') {
            // 表示旋转 45°
            // car.wheel(45*Math.PI/180)
        } else if(event.key === 'd') {
            // 向右拐弯，前轮旋转
            rightHeadWheel.rotation.y -= Math.PI/4
            leftHeadWheel.rotation.y -= Math.PI/4
            rightAfterWheel.rotation.y -= Math.PI/4
            leftAfterWheel.rotation.y -= Math.PI/4

            directionX -= 0.5
            directionZ += 0.5
        }
    }
    document.addEventListener('keypress', move)

}

