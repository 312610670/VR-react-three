import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import OrbitControls from 'three-orbitcontrols'

import {
  // useDispatch,
  useSelector
} from 'react-redux'
import { selectVrData } from '../Design/reselect'
import { selectIsHotspot, selectIsDelete, selectTestData } from '../Design/reselect'

// import { Button, Switch } from 'antd'

import huisuo from 'static/images/huisuo.jpg'
import haibian from 'static/images/haibian.jpg'
import keting from 'static/images/keting.jpg'
import haozhai from 'static/images/haozhai.jpg'

import hotspot from 'static/images/hotspot.jpg'

import './index.css'

const ExhibitionView = () => {
    // const forType = 'Equirectangular'f
    let scene
    //  1、 透视相机                        可查看视野角度            长宽比                     近截面 和远截面
    let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1500)
    /**
     *  透视相机四个参数 ：视野角度
     *      长宽比
     *      近截面
     *      远截面
     **/

    let mesh

    let renderer = new THREE.WebGLRenderer({ antialias: true })

    // -------------自定义滑动查看------------------------------
    // 用户是否交互
    // let isUserInteracting = false
    //  const [isUserInteracting, setIsUserInteracting] = useState(false);
    // let phi = 0
    // let theta = 0
    // -------------自定义滑动查看------------------------------

    // 控制器 对象
    let controls

    // const dispatch = useDispatch()
    const vrData = useSelector(selectVrData())
    console.log(vrData, '===vrData')
    const isHotspot = useSelector(selectIsHotspot()) // 是否投放跳转点 删除
    const isDelete = useSelector(selectIsDelete()) // 是否投放跳转点 删除

    // const panoramicData = useSelector(selectPanoramicData()) // 项目数据
    const testData = useSelector(selectTestData()) // 项目数据
    const { panoramicData } = testData
    console.log(JSON.stringify(testData), '-ceshi shuju ')

    const refIsHotspot = useRef(isHotspot)
    const refIsDelete = useRef(isDelete)
    const drawedHotspotsData = useRef([])

    useEffect(() => {
        changeView('2102271653')
        animate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        refIsHotspot.current = isHotspot
        refIsDelete.current = isDelete
    }, [isHotspot, isDelete])
    //  初始化
    const init = (imgurl = 'huisuo') => {
        scene = new THREE.Scene()
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
        mesh && scene.remove(mesh)
        let width = window.innerWidth
        let height = window.innerHeight
        // if (vrImgurl.length > 1) {
        //     alert('抱歉，一张图请选择panorama1，六张图请选择panorama6且只支持cubeFaces')
        //     return
        // }
        //   //  三维坐标轴
        // var axesHelper = new THREE.AxesHelper(150);
        // scene.add(axesHelper);

        camera.target = new THREE.Vector3(0, 0, 0)
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
        //防止跨域用canvas作为纹理
        let canvas = document.createElement('canvas')
        canvas.style.backgroundColor = 'rgba(255,255,255,0)'
        let context = canvas.getContext('2d')
        let img = new Image()
        img.src = vrImgurl
        img.onload = function () {
            canvas.width = width
            canvas.height = height
            context.drawImage(img, 0, 0, width, height)
            let demo = new THREE.TextureLoader().load(vrImgurl)
            let material = new THREE.MeshBasicMaterial({
                map: demo, // 此处使用 demo 的参数 图片更为清晰
                transparent: false,
            })
            mesh = new THREE.Mesh(geometry, material)
            scene.add(mesh)
        }

        //画已经保存的热点
        setTimeout(() => {
            drawJumpHotSpots(drawedHotspotsData.current, '')
        }, 0)

        renderer.setPixelRatio(window.devicePixelRatio)
        //确保区域大小
        renderer.setSize(width, height)
        container.appendChild(renderer.domElement)

        // 当鼠标指针移动到元素上方，并按下鼠标按键（左、右键均可）
        document
            .getElementsByTagName('canvas')[0]
            .addEventListener('mousedown', onDocumentMouseDown, false)
        initcontrols()
    }

    // 初始化控制器
    const initcontrols = () => {
        controls = new OrbitControls(camera, renderer.domElement)
        //是否可以缩放
        controls.enableZoom = false
        //是否自动旋转
        // controls.autoRotate = true
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
        // update()
        controls && controls.update()
        requestAnimationFrame(animate)
        renderer.render(scene, camera)
    }

    //绘制多个跳转热点
    const drawJumpHotSpots = (variable, newsrc) => {
        console.log(variable, '数据')
        variable.forEach(item => {
            let textImg = getCanvasFont(100, 20, item.name, '#fff')
            let position = item.point
            let canvas = document.createElement('canvas')
            // canvas.style.backgroundColor = 'rgba(255,255,255,0)'
            let context = canvas.getContext('2d')
            canvas.width = 128
            canvas.height = 128
            let img = new Image()
            img.src = hotspot
            img.onload = function () {
                context.drawImage(img, 0, 0, 128, 128)
                // 纹理 添加canvas 图片
                let texture = new THREE.Texture(textImg) // 此处将 图片跟文字画到同一个数据中
                texture.needsUpdate = true // 将其设置为true，以便在下次使用纹理时触发一次更新
                texture.minFilter = THREE.LinearFilter //当一个纹素覆盖小于一个像素时，贴图将如何采样。默认值为THREE.LinearMipmapLinearFilter， 它将使用mipmapping以及三次线性滤镜。
                var spriteMaterial = new THREE.SpriteMaterial({
                    map: texture,
                    transparent: false,
                })
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
                var endV = new THREE.Vector3(
                    position.x * rate,
                    position.y * rate,
                    position.z * rate
                )
                sprite.position.copy(endV)
                scene.add(sprite)
            }
        })
    }

    // 鼠標点击添加一个 确定点击位置  --  锚点 ---待配置 热点图片
    const onDocumentMouseDown = event => {
        // isUserInteracting = true
        event.preventDefault()
        // let vector = new THREE.Vector3() //三维坐标对象
        let vector = camera.target
        vector.set(
            (event.clientX / window.innerWidth) * 2 - 1,
            -(event.clientY / window.innerHeight) * 2 + 1,
            0.5
        )
        vector.unproject(camera)
        let raycaster = new THREE.Raycaster(
            camera.position,
            vector.sub(camera.position).normalize() //初始化
        )
        raycaster.camera = camera
        let intersects = raycaster.intersectObjects(scene.children)
        // 此处点击 判断是否点击锚点 如果是则跳转
        console.log(intersects, '---intersects')
        const target = intersects[0]
        if (target.object.type.toLowerCase() === 'sprite') {
            changeView(target.object.ids)
        }
      
    }

    const getCanvasFont = (w, h, textValue, fontColor) => {
        var canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        var ctx = canvas.getContext('2d')
        ctx.fillStyle = '#ff0000' //textBackground;
        ctx.fillRect(0, 0, w, h)
        ctx.font = h + "px '微软雅黑'"
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillStyle = fontColor
        ctx.fillText(textValue, w / 2, h / 2 + 3)
        //document.body.appendChild(canvas);
        return canvas
    }

    // 鼠标滑动 全景查看
    // const onDocumentMouseMove = event => {
    //     if (isUserInteracting === true) {
    //         console.log('可以移动')
    //         lon = (onPointerDownPointerX - event.clientX) * 0.1 + onPointerDownLon
    //         lat = (event.clientY - onPointerDownPointerY) * 0.1 + onPointerDownLat
    //     }
    // }

    // 鼠标交互结束
    // const onDocumentMouseUp = () => {
    //     isUserInteracting = false
    // }

    const changeView = id => {
        // 初始化锚点数据
        drawedHotspotsData.current = []
        let showVr = []
        panoramicData.forEach(item => {
            if (item.id === id) {
                showVr.push(item)
                // 锚点 切换场景应当切换锚点数据
                drawedHotspotsData.current = item.anchorPoint
            }
        })
        console.log(showVr, '--showVr[0]')
        init(showVr[0].url)
    }

    // const changeView = (id) => {
    //   console.log(panoramicData, 'panoramicData',id)
    //   let showVr =[]
    //   showVr = panoramicData.filter(item => {
    //     return item.id === id
    //   })
    //   console.log(showVr[0],'showVr.url')
    //   init(showVr[0].url)
    // }

    return (
        <div className='container'>
            <div id='container' className='panoramaContent'></div>

            <div className='listView'>
                {panoramicData.map(vrItem => {
                    return (
                        <div
                            key={vrItem.id}
                            className={'listBox'}
                            onClick={() => changeView(vrItem.id)}
                        >
                            <img className={'listImg'} src='./static/images/haibian.jpg' alt='' />
                            <div>{vrItem.name}</div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
export default ExhibitionView
