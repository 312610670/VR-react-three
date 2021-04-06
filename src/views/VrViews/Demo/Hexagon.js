import React, { useEffect, useState } from 'react'
import * as THREE from 'three'
import fore from 'static/images/home.jpg'
import zhengImg from 'static/360D/pz.jpg' //qian
import beiImg from 'static/360D/nz.jpg' //bei
import shangImg from 'static/360D/py.jpg' //shang
import xiaImg from 'static/360D/ny.jpg' // xia
import zuoImg from 'static/360D/nx.jpg' //zuo
import youImg from 'static/360D/px.jpg' // you
import { Switch, Row } from 'antd'

import './hexagon.css'

// imprt { DeviceOrientationControls} from 'three'
import OrbitControls from 'three-orbitcontrols'

let zheng = new THREE.TextureLoader().load(zhengImg)
let bei = new THREE.TextureLoader().load(beiImg)
let shang = new THREE.TextureLoader().load(shangImg)
let xia = new THREE.TextureLoader().load(xiaImg)
let zuo = new THREE.TextureLoader().load(zuoImg)
let you = new THREE.TextureLoader().load(youImg)

let controls
let camera
let renderer
let scene
renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)

camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 100)
camera.position.z = 0.01

const Hexagon = () => {
    const [autoRotate, setAutoRotate] = useState(false)
    const [bgClolr, setBgClolr] = useState({
        q: '',
        h: '',
        z: '',
        y: '',
        s: '',
        x: '',
    })

    const init = () => {
        scene = new THREE.Scene()

        // camera.position.set(300, 200, 0) // 相机位置
        const container = document.getElementById('container')
        container && container.appendChild(renderer.domElement)
        const textures = [zhengImg, beiImg, shangImg, xiaImg, zuoImg, youImg]

        const materials = []
        const faceMaterialArray = []
        // 给每个面填充不同的材质
        faceMaterialArray.push(
            new THREE.MeshBasicMaterial({
                color: bgClolr.y ? bgClolr.y : '',
                map: bgClolr.y ? '' : you,
            })
        ) // 右边
        faceMaterialArray.push(
            new THREE.MeshBasicMaterial({
                color: bgClolr.z ? bgClolr.z : '',
                map: bgClolr.z ? '' : zuo,
            })
        ) // 左边
        faceMaterialArray.push(
            new THREE.MeshBasicMaterial({
                color: bgClolr.s ? bgClolr.s : '',
                map: bgClolr.s ? '' : shang,
            })
        ) //上边
        faceMaterialArray.push(
            new THREE.MeshBasicMaterial({
                color: bgClolr.x ? bgClolr.x : '',
                map: bgClolr.x ? '' : xia,
            })
        ) // 下边
        faceMaterialArray.push(
            new THREE.MeshBasicMaterial({
                color: bgClolr.q ? bgClolr.q : '',
                map: bgClolr.q ? '' : zheng,
            })
        ) //正面
        faceMaterialArray.push(
            new THREE.MeshBasicMaterial({
                color: bgClolr.h ? bgClolr.h : '',
                map: bgClolr.h ? '' : bei,
            })
        )

        let material = new THREE.MeshFaceMaterial(faceMaterialArray)

        const skyBox = new THREE.Mesh(new THREE.BoxGeometry(100, 100, 100), material)
        skyBox.geometry.scale(1, 1, -1)
        scene.add(skyBox)
        window.addEventListener('resize', onWindowResize)
        initcontrols()
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

    const getTexturesFromAtlasFile = (atlasImgUrl, tilesNum) => {
        const textures = []

        for (let i = 0; i < tilesNum; i++) {
            textures[i] = new THREE.Texture()
        }

        const imageObj = new Image()

        imageObj.onload = function () {
            let canvas, context
            const tileWidth = imageObj.height

            for (let i = 0; i < textures.length; i++) {
                canvas = document.createElement('canvas')
                context = canvas.getContext('2d')
                canvas.height = tileWidth
                canvas.width = tileWidth
                context.drawImage(imageObj, tileWidth * i, 0, tileWidth, tileWidth, 0, 0, tileWidth, tileWidth)
                textures[i].image = canvas
                textures[i].needsUpdate = true
            }
        }

        imageObj.src = atlasImgUrl
        console.log(imageObj, '-imageObj')
        return textures
    }

    const onWindowResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()

        renderer.setSize(window.innerWidth, window.innerHeight)
    }

    const animate = () => {
        requestAnimationFrame(animate)

        controls.update() // required when damping is enabled

        renderer.render(scene, camera)
    }

    const randomColor = () => {
        var arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'] // 下标 [0-15]
        var str = '#'
        //生成0-15随机下标
        for (var i = 1; i <= 6; i++) {
            var index = Math.floor(Math.random() * 16)
            str += arr[index]
        }
        return str
    }

    useEffect(() => {
        console.log(bgClolr, '-bgClolr')
        init()
    }, [bgClolr])

    useEffect(() => {
        initcontrols()
    }, [autoRotate])

    useEffect(() => {
        init()
        animate()
    }, [])
    return (
        <div>
            <div id='container'></div>

            <div className='setingBox'>
                <Row>
                    <label htmlFor=''>
                        开启旋转{' '}
                        <Switch
                            onChange={() => {
                                setAutoRotate(!autoRotate)
                            }}
                        />
                    </label>
                </Row>
                <Row>
                    <label htmlFor=''>
                        前
                        <Switch
                            onChange={value => {
                                console.log(value)
                                setBgClolr({
                                    ...bgClolr,
                                    q: value ? randomColor() : null,
                                })
                            }}
                        />
                    </label>
                </Row>
                <Row>
                    <label htmlFor=''>
                        后
                        <Switch
                            onChange={value => {
                                console.log(value)
                                setBgClolr({
                                    ...bgClolr,
                                    h: value ? randomColor() : null,
                                })
                            }}
                        />
                    </label>
                </Row>
                <Row>
                    <label htmlFor=''>
                        左
                        <Switch
                            onChange={value => {
                                console.log(value)
                                setBgClolr({
                                    ...bgClolr,
                                    z: value ? randomColor() : null,
                                })
                            }}
                        />
                    </label>
                </Row>
                <Row>
                    <label htmlFor=''>
                        右
                        <Switch
                            onChange={value => {
                                console.log(value)
                                setBgClolr({
                                    ...bgClolr,
                                    y: value ? randomColor() : null,
                                })
                            }}
                        />
                    </label>
                </Row>
                <Row>
                    <label htmlFor=''>
                        上
                        <Switch
                            onChange={value => {
                                console.log(value)
                                setBgClolr({
                                    ...bgClolr,
                                    s: value ? randomColor() : null,
                                })
                            }}
                        />
                    </label>
                </Row>
                <Row>
                    <label htmlFor=''>
                        下
                        <Switch
                            onChange={value => {
                                console.log(value)
                                setBgClolr({
                                    ...bgClolr,
                                    x: value ? randomColor() : null,
                                })
                            }}
                        />
                    </label>
                </Row>
            </div>
        </div>
    )
}

export default Hexagon
