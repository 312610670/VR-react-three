import React, { useMemo, useEffect, useState, useRef, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid';
import * as THREE from 'three'
import OrbitControls from 'three-orbitcontrols'

import { useDispatch, useSelector } from 'react-redux'
import { selectVrData } from '../reselect'
import { selectIsHotspot, selectIsDelete, selectPanoramicData } from '../reselect'
import { actions } from '../reducers'


import { Button, Switch } from 'antd'

import fore from 'static/images/4.jpg'
import hotspot from 'static/images/hotspot.jpg'
import './index.css'


const forType = 'Equirectangular'
let scene = new THREE.Scene()
//  1、 透视相机                        可查看视野角度            长宽比                     近截面 和远截面
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1500)
/**
 *  透视相机四个参数 ：视野角度
 *      长宽比
 *      近截面
 *      远截面
 **/

let container = document.getElementById('container')
let mesh
let arr = []

let renderer = new THREE.WebGLRenderer({ antialias: true })

// -------------自定义滑动查看------------------------------
// 用户是否交互
let isUserInteracting = false
//  const [isUserInteracting, setIsUserInteracting] = useState(false);
// 点击X 轴坐标
let onPointerDownPointerX = 0
// 点击X 轴坐标
let onPointerDownPointerY = 0
let lon = 0
let lat = 0
let phi = 0
let theta = 0
let onPointerDownLon = lon
let onPointerDownLat = lat
// -------------自定义滑动查看------------------------------

// 控制器 对象
let controls

// 添加锚点的信息
let variable

const Preview = () => {
    const dispatch = useDispatch()
    const vrData = useSelector(selectVrData())
    const isHotspot = useSelector(selectIsHotspot()) // 是否投放跳转点 删除
    const isDelete = useSelector(selectIsDelete()) // 是否投放跳转点 删除

    const panoramicData = useSelector(selectPanoramicData()) // 项目数据

    const [width, setWidth] = useState()
    const [height, setHeight] = useState()
    const [startV, setStartV] = useState()

    const drawedHotspotsData = panoramicData[0].anchorPoint

    const refIsHotspot = useRef(isHotspot)
    const refIsDelete = useRef(isDelete)

    useEffect(() => {
        init()
        animate()
    }, [])

    useEffect(() => {
        refIsHotspot.current = isHotspot
        refIsDelete.current = isDelete
    }, [isHotspot, isDelete])
    //  初始化
    const init = (imgurl = [fore]) => {
        console.log('執行初始化')
        let width = document.getElementById('container').getBoundingClientRect().width
        let height = document.getElementById('container').getBoundingClientRect().height - 32
        if (imgurl.length > 1) {
            alert('抱歉，一张图请选择panorama1，六张图请选择panorama6且只支持cubeFaces')
            return
        }
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
        img.src = fore
        img.onload = function () {
            canvas.width = width
            canvas.height = height
            context.drawImage(img, 0, 0, width, height)
            let demo = new THREE.TextureLoader().load(fore)
            let material = new THREE.MeshBasicMaterial({
                map: demo, // 此处使用 demo 的参数 图片更为清晰
                transparent: false,
            })
            mesh = new THREE.Mesh(geometry, material)
            scene.add(mesh)
        }

        //画已经保存的热点
        setTimeout(() => {
            drawJumpHotSpots(drawedHotspotsData, '')
            // addDsc()
        }, 1000)

        renderer.setPixelRatio(window.devicePixelRatio)
        //确保区域大小
        renderer.setSize(width, height)
        container = document.getElementById('container')
        container.appendChild(renderer.domElement)

        // 当鼠标指针移动到元素上方，并按下鼠标按键（左、右键均可）
        document
            .getElementsByTagName('canvas')[0]
            .addEventListener('mousedown', onDocumentMouseDown, false)
        document
            .getElementsByTagName('canvas')[0]
            .addEventListener('mousemove', onDocumentMouseMove, false)
        document
            .getElementsByTagName('canvas')[0]
            .addEventListener('mouseup', onDocumentMouseUp, false)
        controls = new OrbitControls(camera, renderer.domElement)
    }

    // 执行渲染
    const update = () => {
        //控制自动旋转速度
        if (isUserInteracting === false) {
            lon += 0
        }
        lat = Math.max(-85, Math.min(85, lat))
        phi = THREE.Math.degToRad(90 - lat)
        theta = THREE.Math.degToRad(lon) //degToRad()方法返回与参数degrees所表示的角度相等的弧度值
        camera.target.x = 500 * Math.sin(phi) * Math.cos(theta)
        camera.target.y = 500 * Math.cos(phi)
        camera.target.z = 500 * Math.sin(phi) * Math.sin(theta)
        camera.lookAt(camera.target)
        renderer.render(scene, camera)
    }

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
        let textImg = getCanvasFont(100, 50, '我也不知道', 'green')
        variable.forEach(item => {
            let position = item.point
            let canvas = document.createElement('canvas')
            canvas.style.backgroundColor = 'rgba(255,255,255,0)'
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
                sprite.name = item.name; 
                sprite.ids = item.id;
                sprite.iconUrl = '';
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
        isUserInteracting = true
        if (forType === 'Equirectangular') {
            event.preventDefault()
            // let vector = new THREE.Vector3() //三维坐标对象
            let vector = camera.target
            vector.set(
                ((event.clientX - 248) / (window.innerWidth - 248)) * 2 - 1,
                -((event.clientY - 32) / (window.innerHeight - 32)) * 2 + 1,
                0.5
            )
            vector.unproject(camera)
            let raycaster = new THREE.Raycaster(
                camera.position,
                vector.sub(camera.position).normalize() //初始化
            )
            raycaster.camera = camera
            let intersects = raycaster.intersectObjects(scene.children)
            //如果绘制热点属于激活状态
          console.log(intersects, '---intersects')
              // 此处需要判断 是否有两个坐标为0 
            let isOnShaft  = []
            Object.keys(intersects[0].point).forEach((v) => {
              if (intersects[0].point[v] === 0) {
                isOnShaft.push(1)
              }
            })
            // 添加標注
            if (refIsHotspot.current && isOnShaft.length < 2 && !refIsDelete.current) {
                let canvas = document.createElement('canvas')
                canvas.style.backgroundColor = 'rgba(255,255,255,0)'
                let context = canvas.getContext('2d')
                canvas.width = 128
                canvas.height = 128
                let img = new Image()
                //这里发布的时候会出现http://localhost:8083/web/dist/static/images/hotspot.jpg
                // img.src = "www.baidu.com/img/flexible/logo/pc/result.png";
                //发布用
                img.src = hotspot
                img.onload = function () {
                    context.drawImage(img, 0, 0, 128, 128)
                    let texture = new THREE.Texture(canvas)
                    texture.needsUpdate = true
                    texture.minFilter = THREE.LinearFilter
                    var spriteMaterial = new THREE.SpriteMaterial({
                        map: texture,
                        transparent: false,
                    })
                    var sprite = new THREE.Sprite(spriteMaterial)
                    sprite.scale.set(30, 30, 30)
                    let rate = 0.8
                    var endV = new THREE.Vector3(intersects[0].point.x * rate, intersects[0].point.y * rate, intersects[0].point.z * rate)
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
                                // this.$store.commit("deletedHotSpot");
                                // this.$store.commit("hideHotSpot");
                                // let location = target.object.position;
                                // let panAndTilt = this.calculatePanandTilt(
                                //   location.x * 1.25,
                                //   location.y * 1.25,
                                //   location.z * 1.25
                                // );
                                // this.$store.commit("showJumpHotSpot");
                                // this.$store.commit("saveTempLocation", {
                                //   location: [
                                //     location.x * 1.25,
                                //     location.y * 1.25,
                                //     location.z * 1.25
                                //   ],
                                //   panAndTilt: panAndTilt,
                                //   ID:"JumpHotSpot",
                                // });
                            }
                        }
                    } catch (e) {
                        console.log(e)
                    }
                }
            }
        }
        onPointerDownPointerX = event.clientX
        onPointerDownPointerY = event.clientY
        onPointerDownLon = lon
        onPointerDownLat = lat
  }
  
  // 添加后将数据同步redux 数组中
  const addHotspot = (coordinate) =>{
      console.log(coordinate,'---coordinate')
      // 
    let newAnchorPoint = {
      point: {
        x:coordinate.x,
        y: coordinate.y,
        z: coordinate.z,
      },
      id: uuidv4(),
      name: '这是第二个锚点',
      iconUrl: ''
    }
    dispatch(actions.addAnchorPoint(newAnchorPoint))
  }

    // 添加描述
    const addDsc = () => {
        //用canvas生成图片
        let canvas = document.createElement('canvas')
        let ctx = canvas.getContext('2d')
        canvas.width = 300
        canvas.height = 300
        //制作矩形
        ctx.fillStyle = '#0e0d0d'
        ctx.fillRect(0, 0, 300, 300)
        ctx.fillStyle = '#141414'
        ctx.font = 'normal 18pt "楷体"'
        ctx.fillText('模型介绍', 100, 20)
        let textWord = '该模型由小少小同学制作完成'
        //文字换行
        let len = parseInt(textWord.length / 10)
        for (let i = 0; i < len + 1; i++) {
            let space = 10
            if (i === len) {
                space = textWord.length - len * 10
            }
            console.log('len+' + len, 'space+' + space)
            let word = textWord.substr(i * 10, space)
            ctx.fillText(word, 15, 60 * (i + 1))
        }
        //生成图片
        let url = canvas.toDataURL('image/png')
        //将图片构建到纹理中
        let geometry1 = new THREE.PlaneGeometry(30, 30)
        let texture = THREE.ImageUtils.loadTexture(url, null, function (t) {})

        let material1 = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.DoubleSide,
            opacity: 1,
            transparent: true,
        })

        let rect = new THREE.Mesh(geometry1, material1)
        rect.position.set(43, 40, 25)
        scene.add(rect)
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
    const onDocumentMouseMove = event => {
        if (isUserInteracting === true) {
            console.log('可以移动')
            lon = (onPointerDownPointerX - event.clientX) * 0.1 + onPointerDownLon
            lat = (event.clientY - onPointerDownPointerY) * 0.1 + onPointerDownLat
        }
    }

    // 鼠标交互结束
    const onDocumentMouseUp = () => {
        isUserInteracting = false
    }

    // redux 配置
    const isHotspotChange = () => {
        dispatch(actions.changeIsHotspot(!isHotspot))
    }

    return (
        <div className='container'>
            <div id='container' className='panoramaContent'></div>
        </div>
    )
}
export default Preview
