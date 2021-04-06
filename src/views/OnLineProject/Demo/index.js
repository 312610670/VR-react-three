import React, { useEffect } from 'react'
import * as THREE from 'three'
import fore from 'static/images/home.jpg'
import zhengImg from 'static/360D/1.jpg'
import beiImg from 'static/360D/2.jpg'
import shangImg from 'static/360D/3.jpg'
import xiaImg from 'static/360D/4.jpg'
import zuoImg from 'static/360D/5.jpg'
import youImg from 'static/360D/6.jpg'

import OrbitControls from 'three-orbitcontrols'
// 场景
var scene = new THREE.Scene()

// 渲染器
var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })

// 相机
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
// 盒子 物体
var geometry = new THREE.BoxGeometry(50, 50, 50) // 六张图

// w外层盒子
var geometryone = new THREE.SphereGeometry(500, 60, 40) // 球体
geometryone.scale(-1, 1, 1)

// 背景
let material

// 创建平面
let cube

let controls
const DemoBox = () => {
    const init = () => {
        renderer.setSize(window.innerWidth, window.innerHeight)
        document.getElementById('View').appendChild(renderer.domElement)
        document.body.appendChild(renderer.domElement)

        // 六张图 内部物体展示
        let zheng = new THREE.TextureLoader().load(zhengImg)
        let bei = new THREE.TextureLoader().load(beiImg)
        let shang = new THREE.TextureLoader().load(shangImg)
        let xia = new THREE.TextureLoader().load(xiaImg)
        let zuo = new THREE.TextureLoader().load(zuoImg)
        let you = new THREE.TextureLoader().load(youImg)
        const faceMaterialArray = []
        // 给每个面填充不同的材质
        faceMaterialArray.push(new THREE.MeshBasicMaterial({ map: zuo })) //左边
        faceMaterialArray.push(new THREE.MeshBasicMaterial({ map: you })) // 右边
        faceMaterialArray.push(new THREE.MeshBasicMaterial({ map: shang })) //上边
        faceMaterialArray.push(new THREE.MeshBasicMaterial({ map: xia })) // 下边
        faceMaterialArray.push(new THREE.MeshBasicMaterial({ map: zheng })) //正面
        faceMaterialArray.push(new THREE.MeshBasicMaterial({ map: bei })) // 背面
        material = new THREE.MeshFaceMaterial(faceMaterialArray)

        //防止跨域用canvas作为纹理 外部背景
        let canvas = document.createElement('canvas')
        canvas.style.backgroundColor = 'rgba(255,255,255,0)'
        let context = canvas.getContext('2d')
        let img = new Image()
        img.src = fore
        img.onload = function () {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
            context.drawImage(img, 0, 0, window.innerWidth, window.innerHeight)
            let demo = new THREE.TextureLoader().load(fore)
            let materialone = new THREE.MeshBasicMaterial({
                map: demo, // 此处使用 demo 的参数 图片更为清晰
                transparent: false,
            })
            let cubeone
            cubeone = new THREE.Mesh(geometryone, materialone)
            scene.add(cubeone)
        }

        // 三维坐标轴
        var axesHelper = new THREE.AxesHelper(150)
        scene.add(axesHelper)

        // 渲染器
        // BoxGeometry 这个对象包含了一个立方体中所有的顶点（vertices）和面（faces）
        cube = new THREE.Mesh(geometry, material)
        cube.position.set(0, 0, 0) // w物体放置位置
        scene.add(cube)
        camera.position.set(300, 200, 0) // 相机位置
        initControls()
    }

    const initControls = () => {
        controls = new OrbitControls(camera, renderer.domElement)
    }

    const painting = () => {
        var geometry = new THREE.Geometry()
        geometry.vertices.push(new THREE.Vector3(0, 50, 50))
        // geometry.vertices.push(new THREE.Vector3( 0, 70, 50) );
        geometry.vertices.push(new THREE.Vector3(100, 100, 100))
        var line = new THREE.Line(geometry, material)
        scene.add(line)
    }

    const animate = () => {
        controls && controls.update()
        requestAnimationFrame(animate)
        renderer.render(scene, camera)
    }

    useEffect(() => {
        painting()
        init()
        animate()
        return () => {}
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div>
            <div id='View'></div>
        </div>
    )
}

export default DemoBox
