import React, { useEffect, useRef, useMemo } from 'react'
import { v4 as uuidv4 } from 'uuid'
import * as THREE from 'three'
import OrbitControls from 'three-orbitcontrols'

import { useDispatch, useSelector } from 'react-redux'
// import { selectVrData } from '../reselect'

import { BrowserRouter as Router, Route, Switch, useParams, useLocation } from 'react-router-dom'

import {
    selectIsHotspot,
    selectIsDelete,
    selectActiveId,
    selectPanoramicData,
    selectAutoRotate,
} from '../reselect'
import { actions } from '../reducers'

import qs from 'qs'
// import { Button, Switch } from 'antd'

import fore from 'static/images/huisuo.jpg'
import huisuo from 'static/images/huisuo.jpg'
import haibian from 'static/images/haibian.jpg'
import keting from 'static/images/keting.jpg'
import haozhai from 'static/images/haozhai.jpg'
import gif from 'static/images/zhe.gif'

import hotspot from 'static/images/hotspot.jpg'
import './index.css'

const forType = 'Equirectangular'
// 控制器 对象
const Preview = props => {
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
        // 获取当前编辑数据 初始化数据只存在
        // setTimeout(() => {
        //     dispatch(
        //         actions.changeProjectData({
        //             name: '想放弃了',
        //             id: '2102271653',
        //             url: '',
        //             status: '',
        //             scene_list: [],
        //         })
        //     )
        // }, 3000)
        return () => {}
    }, [query])

    let scene = new THREE.Scene()
    //  1、 透视相机                        可查看视野角度            长宽比                     近截面 和远截面
    let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1500)
    /**
     *  透视相机四个参数 ：视野角度
     *      长宽比
     *      近截面
     *      远截面
     **/
    let renderer = new THREE.WebGLRenderer({ antialias: true })

    let controls
    let mesh

    // 设置全场唯一canvas

    useEffect(() => {
        changeView(activeId ? activeId : '2102271653')
       
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeId])

    useEffect(() => {
        refIsHotspot.current = isHotspot
        refIsDelete.current = isDelete
    }, [isHotspot, isDelete])

    const changeView = id => {
        // 初始化锚点数据
        drawedHotspotsData.current = []
        let showVr = []
        if (panoramicData.length > 0) {
            panoramicData.forEach(item => {
                if (item.id === id) {
                    showVr.push(item)
                    // 锚点 切换场景应当切换锚点数据
                    drawedHotspotsData.current = item.anchor_list
                }
            })
            console.log(panoramicData, '--showVr--', showVr)
            init(panoramicData[0].url)
      }
      
  }
  useEffect(() => {
    if (panoramicData.length > 0) {
      init(panoramicData[0].url)
    }
  }, [panoramicData])

    //  初始化
  const init = (imgurl = fore) => {
      console.log(imgurl,'----imgurl')
        // 初始化先删除子节点
        let container = document.getElementById('container')
        if (container.childNodes.length) {
            container.removeChild(container.childNodes[0])
        }
        let vrImgurl =
            imgurl === 'imgurl'
                ? huisuo
                : imgurl === 'haibian'
                ? haibian
                : imgurl === 'keting'
                ? keting
                : imgurl === 'haozhai'
                ? haozhai
                : huisuo
        console.log(vrImgurl, '---vrImgurl')
        mesh && scene.remove(mesh)
        let width = document.getElementById('container').getBoundingClientRect().width
        let height = document.getElementById('container').getBoundingClientRect().height - 32
        if ([vrImgurl].length > 1) {
            alert('抱歉，一张图请选择panorama1，六张图请选择panorama6且只支持cubeFaces')
            return
        }
        // //  三维坐标轴
        // var axesHelper = new THREE.AxesHelper(150);
        // scene.add(axesHelper);

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

        let demo = new THREE.TextureLoader().load(vrImgurl)
        let material = new THREE.MeshBasicMaterial({
            map: demo, // 此处使用 demo 的参数 图片更为清晰
            transparent: false,
        })
        mesh = new THREE.Mesh(geometry, material)
        // 几何体  材料（渲染图）
        scene.add(mesh)
        //画已经保存的热点
        setTimeout(() => {
            drawJumpHotSpots(drawedHotspotsData.current, '')
            // addDsc()
        }, 0)
        renderer.setPixelRatio(window.devicePixelRatio)
        //确保区域大小
        renderer.setSize(width, height)
        // 添加前 先删除之前的子元素 再添加新VR图
        container.appendChild(renderer.domElement)

        // 当鼠标指针移动到元素上方，并按下鼠标按键（左、右键均可）
        document
            .getElementsByTagName('canvas')[0]
            .addEventListener('mousedown', onDocumentMouseDown, false)
        // document
        //     .getElementsByTagName('canvas')[0]
        //     .addEventListener('mousemove', onDocumentMouseMove, false)
        // document
        //     .getElementsByTagName('canvas')[0]
        //     .addEventListener('mouseup', onDocumentMouseUp, false)
        animate()
        initcontrols()
    }
    // 初始化控制器
    const initcontrols = () => {
        controls = new OrbitControls(camera, renderer.domElement)
        console.log(controls, '--controls')
        //是否可以缩放
        controls.enableZoom = false
        //是否自动旋转
        controls.autoRotate = autoRotate
        // 使动画循环使用时阻尼或自转 意思是否有惯性
        controls.enableDamping = true
        controls.zoom0 = 0
        controls.zoomSpeed = 0
    }

    // 执行渲染
    // const update = () => {
    //     //控制自动旋转速度
    //     if (isUserInteracting === false) {
    //         lon += 0
    //     }
    //     lat = Math.max(-85, Math.min(85, lat))
    //     phi = THREE.Math.degToRad(90 - lat)
    //     theta = THREE.Math.degToRad(lon) //degToRad()方法返回与参数degrees所表示的角度相等的弧度值
    //     camera.target.x = 500 * Math.sin(phi) * Math.cos(theta)
    //     camera.target.y = 500 * Math.cos(phi)
    //     camera.target.z = 500 * Math.sin(phi) * Math.sin(theta)
    //     camera.lookAt(camera.target)
    //     renderer.render(scene, camera)
    // }

    // 递归调用
    const animate = () => {
        controls && controls.update()
        requestAnimationFrame(animate)
        renderer.render(scene, camera)
    }

    //绘制多个跳转热点
    const drawJumpHotSpots = (variable, newsrc) => {
        console.log(variable, '数据')
        variable.length> 0 && variable.forEach(item => {
            // let position = item.point
            // TextureLoader 异步记载图片
            var texture = new THREE.TextureLoader().load(gif)
            // SpriteMaterial 材质
            var spriteMaterial = new THREE.SpriteMaterial({
                map: texture,
                transparent: true,
            })
            // 物体 Sprite
            var sprite = new THREE.Sprite(spriteMaterial)
            sprite.scale.set(30, 30, 30)
            /**
             * 此处添加自定义属性 不能跟原有属性重复避免报错
             * name: 添加锚点名称
             * ids: 唯一ID
             * iconUrl: 图标
             */
            sprite.name = item.name
            sprite.ids = item.id
            sprite.iconUrl = ''
            let rate = 0.8
            var endV = new THREE.Vector3(item.x_axis * rate, item.Y_axis * rate, item.z_axis * rate)
            sprite.position.copy(endV)
            scene.add(sprite)
        })
    }

    // 鼠標点击添加一个 确定点击位置  --  锚点 ---待配置 热点图片
    const onDocumentMouseDown = event => {
        /**
     * 1、 camera.target 当前相机所正视的世界空间方向 赋值给 vector
     * 2、根据配置页面 展示的宽高值 设置XYZ 轴
     * 3、 vector.unproject(camera) 在投影中使用的摄像机。
     * 4、 使用 光线投射Raycaster 计算鼠标在三维坐标中点击的坐标位置
     *     这将创建一个新的raycaster对象。
     *        let raycaster = new THREE.Raycaster(
     *            camera.position,
     *            vector.sub(camera.position).normalize() //初始化
     *        )
     *      Raycaster( origin : Vector3, direction : Vector3, near : Float, far : Float ) {
            origin —— 光线投射的原点向量。
            direction —— 向射线提供方向的方向向量，应当被标准化。
            near —— 返回的所有结果比near远。near不能为负值，其默认值为0。
            far —— 返回的所有结果都比far近。far不能小于near，其默认值为Infinity（正无穷。）
     * 
     * 
     * 
     * 
    */
        // isUserInteracting = true
        if (forType === 'Equirectangular') {
            event.preventDefault()
            // let vector = new THREE.Vector3() //三维坐标对象
            let vector = camera.target
            console.log(vector, 'vector预计是坐标轴的位置')
            vector.set(
                ((event.clientX - 248) / (window.innerWidth - 248)) * 2 - 1,
                -((event.clientY - 32) / (window.innerHeight - 32)) * 2 + 1,
                0.5
            )
            // 在投影中使用的摄像机。
            vector.unproject(camera)
            // 这将创建一个新的raycaster对象。
            let raycaster = new THREE.Raycaster(
                camera.position,
                vector.sub(camera.position).normalize() //初始化 光线投射的原点向量
            )
            raycaster.camera = camera
            // 得到 点击的坐标 或 点击的标注点
            // intersects 每项中的object 的type 可以分辨 点击的是标注还是 场景图
            let intersects = raycaster.intersectObjects(scene.children)
            //如果绘制热点属于激活状态
            // 此处需要判断 是否有两个坐标为0
            let isOnShaft = []
            Object.keys(intersects[0].point).forEach(v => {
                if (intersects[0].point[v] === 0) {
                    isOnShaft.push(1)
                }
            })
            // 添加標注
            if (refIsHotspot.current && isOnShaft.length < 2 && !refIsDelete.current) {
                let img = new Image()
                //这里发布的时候会出现http://localhost:8083/web/dist/static/images/hotspot.jpg
                // img.src = "www.baidu.com/img/flexible/logo/pc/result.png";
                //发布用
                img.src = hotspot
                img.onload = function () {
                    // let texture = new THREE.TextureLoader().load(img)
                    // // TextureLoader 异步记载图片
                    // var texture = new THREE.TextureLoader().load(gif)
                    // // SpriteMaterial 材质
                    // var spriteMaterial = new THREE.SpriteMaterial({
                    //     map: texture,
                    //     transparent: true,
                    // })
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
                    var endV = new THREE.Vector3(
                        intersects[0].point.x * rate,
                        intersects[0].point.y * rate,
                        intersects[0].point.z * rate
                    )
                    sprite.position.copy(endV)
                    scene.add(sprite)
                    addHotspot(intersects[0].point)
                }
                //移除热点
            } else {
                if (!refIsDelete.current) return
                if (intersects.length > 0) {
                    const target = intersects[0]
                    console.log(!refIsHotspot.current, refIsDelete.current, '删除打印结果')
                    try {
                        if (target.object && target.object.type.length > 0) {
                            if (target.object.type.toLowerCase() === 'sprite') {
                                scene.remove(target.object)
                            }
                        }
                    } catch (e) {
                        console.log(e)
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
            targect_scene_id: uuidv4(),
            url: '',
            status:''
        }
        dispatch(actions.addAnchorPoint(newAnchorPoint))
    }

    // redux 配置
    // const isHotspotChange = () => {
    //     dispatch(actions.changeIsHotspot(!isHotspot))
    // }

    return (
        <div className='container'>
            <div id='container' className='panoramaContent'></div>
        </div>
    )
}
export default Preview
