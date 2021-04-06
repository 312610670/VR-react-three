import React, { useEffect, useRef, useMemo, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
import * as THREE from 'three'
import OrbitControls from 'three-orbitcontrols'

import { useDispatch, useSelector } from 'react-redux'
// import { selectVrData } from '../reselect'

import { BrowserRouter as Router, Route, Switch, useParams, useLocation } from 'react-router-dom'

import { selectIsHotspot, selectIsDelete, selectActiveId, selectPanoramicData, selectAutoRotate } from '../reselect'
import { actions, getProjectData, getScene } from '../reducers'

import qs from 'qs'
// import { Button, Switch } from 'antd'

import fore from 'static/images/huisuo.jpg'

import hotspot from 'static/images/hotspot.jpg'
import './index.css'

const forType = 'Equirectangular'

let controls
let scene

// 控制器 对象
const Preview = props => {
    let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1500)
    let renderer = new THREE.WebGLRenderer({ antialias: true })
    let mesh

    const location = useLocation()
    const query = useMemo(() => {
        return qs.parse(location.search.slice(1))
    }, [location.search])
    const dispatch = useDispatch()
    // const OnLineProject = useSelector(selectVrData())
    const isHotspot = useSelector(selectIsHotspot()) // 是否投放跳转点 删除
    const isDelete = useSelector(selectIsDelete()) // 是否投放跳转点 删除
    const autoRotate = useSelector(selectAutoRotate())

    // 可展示數據
    const panoramicData = useSelector(selectPanoramicData()) // 项目数据
    const activeId = useSelector(selectActiveId()) // 当前高亮视图ID
    const refIsHotspot = useRef(isHotspot)
    const refIsDelete = useRef(isDelete)
    const drawedHotspotsData = useRef([])

    // 1、 根据路由获取当前场景数据
    useEffect(() => {
        dispatch(getScene({ project_id: query.id }))
    }, [dispatch, query])

    useEffect(() => {
        // 数据改变
        console.log(panoramicData, activeId, '数据改变')
        changeView(activeId)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeId, panoramicData])

    useEffect(() => {
        refIsHotspot.current = isHotspot
        refIsDelete.current = isDelete
    }, [isHotspot, isDelete])

    const changeView = id => {
        // 初始化锚点数据
        drawedHotspotsData.current = []
        let showVr = []
        if (panoramicData.length > 0) {
            for (var i = 0; i < panoramicData.length; i++) {
                if (panoramicData[i].uni_scene_id === activeId) {
                    showVr.push(panoramicData[i])
                    // 锚点 切换场景应当切换锚点数据
                    drawedHotspotsData.current = panoramicData[i].anchor_list
                    break
                }
            }
            console.log(showVr[0], '--showVr[0]')
            showVr[0] && init(showVr[0].url, showVr[0])
        }
        console.log(drawedHotspotsData.current, '-- drawedHotspotsData.current')
    }
    //  初始化
    const init = (imgurl = fore, data) => {
        scene = new THREE.Scene()
        // 初始化先删除子节点
        let container = document.getElementById('container')
        if (container.childNodes.length) {
            container.removeChild(container.childNodes[0])
        }
        mesh && scene.remove(mesh)
        let width = document.getElementById('container').getBoundingClientRect().width
        let height = document.getElementById('container').getBoundingClientRect().height - 32
        if ([imgurl].length > 1) {
            alert('抱歉，一张图请选择panorama1，六张图请选择panorama6且只支持cubeFaces')
            return
        }
        //  三维坐标轴
        var axesHelper = new THREE.AxesHelper(150)
        scene.add(axesHelper)
        // camera.lookAt(new THREE.Vector3(0, 0, 0)); // Target
        camera.target = new THREE.Vector3(0, 0, 0) // 调用该函数的结果将复制给该Vector3对象。
        camera.position.set(-10, 0, -10)
        // SphereGeometry(radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength)
        // - radius：球体半径
        // - widthSegments,
        // - heightSegments：水平方向和垂直方向上分段数。widthSegments最小值为3，默认值为8。heightSegments最小值为2，默认值为6。
        // - phiStart：水平方向上的起始角,默认值0
        // - phiLenght：水平方向上球体曲面覆盖的弧度，默认Math.PI * 2
        // - thetaStart : 垂直方向上的起始角， 默认0
        // - thetaLength: 垂直方向是球体曲面覆盖的弧度，默认值为Math.PI
        const geometry = new THREE.SphereGeometry(500, 60, 40)
        geometry.scale(-1, 1, 1)

        let img = new Image()
        img.src = imgurl || '可上传定制'
        img.onload = function () {
            let demo = new THREE.TextureLoader().load(imgurl)
            let material = new THREE.MeshBasicMaterial({
                map: demo, // 此处使用 demo 的参数 图片更为清晰
                transparent: false,
            })
            mesh = new THREE.Mesh(geometry, material)
            // 添加参数
            mesh.uni_scene_id = data.uni_scene_id
            mesh.name = data.name
            scene.add(mesh)
        }

        // 几何体  材料（渲染图）
        //画已经保存的热点
        setTimeout(() => {
            drawJumpHotSpots(drawedHotspotsData.current, '')
            // addDsc()
        }, 0)
        // 设置设备像素比
        renderer.setPixelRatio(window.devicePixelRatio)
        //将输出canvas的大小调整为(width, height)并考虑设备像素比
        renderer.setSize(width, height)
        //   添加前 先删除之前的子元素 再添加新VR图
        container.appendChild(renderer.domElement)
        // 当鼠标指针移动到元素上方，并按下鼠标按键（左、右键均可）
        document.getElementsByTagName('canvas')[0].addEventListener('mousedown', onDocumentMouseDown, false)
        initcontrols()
        animate()
        // document
        // .getElementsByTagName('canvas')[0]
        // .addEventListener('mouseup', onDocumentMouseupn, false)
    }

    // 初始化控制器
    const initcontrols = () => {
        controls = new OrbitControls(camera, renderer.domElement)
        //是否可以缩放
        controls.enableZoom = false
        //是否自动旋转
        controls.autoRotate = autoRotate
        // 使动画循环使用时阻尼或自转 意思是否有惯性
        controls.enableDamping = true
        controls.zoom0 = 0
        controls.zoomSpeed = 0
    }

    useEffect(() => {
        initcontrols()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [autoRotate])

    // const onDocumentMouseupn = () => {
    //  let a =  controls.getAzimuthalAngle() //  radians 获得用弧度表示的当前水平旋转角度
    //  let b = controls.getPolarAngle() //  radians 获得用弧度表示的当前水平旋转角度
    //   console.log(a, b, '---')
    // 1.7935598913571067 1.707964911497379
    // }

    // controls.addEventListener('change', render);
    // 递归调用
    const animate = () => {
        controls && controls.update()
        requestAnimationFrame(animate)
        renderer.render(scene, camera)
    }

    //绘制多个跳转热点
    const drawJumpHotSpots = (variable, newsrc) => {
        console.log(variable, '数据')
        variable.forEach(item => {
            let img = new Image()
            img.src = hotspot || '可上传定制'
            img.onload = function () {
                // context.drawImage(img, 0, 0, 128, 128)
                // 纹理 添加canvas 图片
                let texture = new THREE.Texture(img) // 此处将 图片跟文字画到同一个数据中
                texture.needsUpdate = true // 将其设置为true，以便在下次使用纹理时触发一次更新
                texture.minFilter = THREE.LinearFilter //当一个纹素覆盖小于一个像素时，贴图将如何采样。默认值为THREE.LinearMipmapLinearFilter， 它将使用mipmapping以及三次线性滤镜。
                var spriteMaterial = new THREE.SpriteMaterial({
                    map: texture,
                    transparent: false,
                })
                var sprite = new THREE.Sprite(spriteMaterial)
                sprite.scale.set(30, 30, 30)
                /**∏∏
                 * 此处添加自定义属性 不能跟原有属性重复避免报错
                 * name: 添加锚点名称
                 * ids: 唯一ID
                 * iconUrl: 图标
                 */
                sprite.name = item.name
                sprite.ids = item.id
                sprite.iconUrl = ''
                sprite.uni_anchor_id = item.uni_anchor_id || ''
                sprite.targect_scene_id = item.targect_scene_id || ''
                let rate = 0.8
                var endV = new THREE.Vector3(item.x_axis * rate, item.y_axis * rate, item.z_axis * rate)
                sprite.position.copy(endV)
                sprite.position.copy(endV)
                scene.add(sprite)
            }
        })
    }

    // 鼠標点击添加一个 确定点击位置  --  锚点 ---待配置 热点图片
    const onDocumentMouseDown = event => {
        if (forType === 'Equirectangular') {
            event.preventDefault()
            // let vector = new THREE.Vector3() //三维坐标对象
            let vector = camera.target
            // /新建一个三维单位向量 假设z方向就是0.5
            //根据照相机，把这个向量转换到视点坐标系
            vector.set(((event.clientX - 248) / (window.innerWidth - 248)) * 2 - 1, -((event.clientY - 32) / (window.innerHeight - 32)) * 2 + 1, 0.5)
            // 在投影中使用的摄像机。
            vector.unproject(camera)
            // 这将创建一个新的raycaster对象。
            //在视点坐标系中形成射线,射线的起点向量是照相机， 射线的方向向量是照相机到点击的点，这个向量应该归一标准化
            let raycaster = new THREE.Raycaster(
                camera.position,
                vector.sub(camera.position).normalize() //初始化 光线投射的原点向量
            )
            // console.log(vector.sub(camera.position).normalize() ,'-vector.sub(camera.position).normalize() ')

            // 计算出鼠标经过的3d空间中的对象
            // Raycaster( origin, direction, near, far ) { }
            // origin — 射线的起点向量。
            // direction — 射线的方向向量，应该归一化。
            // near — 所有返回的结果应该比 near 远。Near不能为负，默认值为0。
            // far — 所有返回的结果应该比 far 近。Far 不能小于 near，默认值为无穷大。

            raycaster.camera = camera
            // 得到 点击的坐标 或 点击的标注点
            // intersects 每项中的object 的type 可以分辨 点击的是标注还是 场景图

            let intersects = raycaster.intersectObjects(scene.children)
            //如果绘制热点属于激活状态
            // 此处需要判断 是否有两个坐标为0
            let isOnShaft = []
            intersects.length > 0 &&
                Object.keys(intersects[0].point).forEach(v => {
                    if (intersects[0].point[v] === 0) {
                        isOnShaft.push(1)
                    }
                })
            // 添加標注
            if (refIsHotspot.current && isOnShaft.length < 2 && !refIsDelete.current) {
                let img = new Image()
                img.src = hotspot
                img.onload = function () {
                    let texture = new THREE.Texture(img)
                    texture.needsUpdate = true
                    texture.minFilter = THREE.LinearFilter
                    var spriteMaterial = new THREE.SpriteMaterial({
                        map: texture,
                        transparent: false,
                    })
                    // 创建一个 sprite  物体
                    var sprite = new THREE.Sprite(spriteMaterial)
                    sprite.scale.set(30, 30, 30) // 视图大小
                    let rate = 0.8
                    var endV = new THREE.Vector3(intersects[0].point.x * rate, intersects[0].point.y * rate, intersects[0].point.z * rate)
                    sprite.position.copy(endV)
                    scene.add(sprite)
                    addHotspot(intersects[0].point)
                }
                //移除热点
            } else {
                const { object } = intersects[0]
                const { uuid, parent } = object
                console.log(object.uni_anchor_id, '--object')

                if (object && object.type.length > 0 && object.type.toLowerCase() === 'sprite') {
                    let parentUuid = ''
                    // 获取背景 uni_scene_id 需要找到父级的子集下包含 type = Mesh 的 uni_scene_id
                    parent.children.forEach(child => {
                        if (child.type === 'Mesh') {
                            parentUuid = child.uni_scene_id
                        }
                    })
                    console.log(parentUuid, '--parentUuid')
                    if (refIsDelete.current) {
                        scene.remove(object)
                        dispatch(
                            actions.deleteLabel({
                                uni_anchor_id: object.uni_anchor_id,
                                parentUuid: parentUuid,
                            })
                        )
                    } else {
                        // 选中值
                        dispatch(
                            actions.selectedLabel({
                                uni_anchor_id: object.uni_anchor_id,
                                parentUuid: parentUuid,
                                name: object.name,
                                targect_scene_id: object.targect_scene_id,
                            })
                        )
                    }
                }
            }
        }
    }

    // 添加后将数据同步redux 数组中
    const addHotspot = coordinate => {
        console.log(coordinate, '---coordinate')
        let newAnchorPoint = {
            x_axis: coordinate.x,
            y_axis: coordinate.y,
            z_axis: coordinate.z,
            id: '',
            name: '这是一个锚点',
            iconUrl: '',
            targect_scene_id: '',
            uni_anchor_id: uuidv4(),
            url: '',
            status: '',
        }
        dispatch(actions.addAnchorPoint(newAnchorPoint))
    }

    return (
        <div className='container'>
            <div id='container' className='panoramaContent'></div>
        </div>
    )
}
export default Preview
