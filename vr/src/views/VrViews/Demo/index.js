import React, { useEffect } from 'react'
import * as THREE from 'three';
import fore from 'static/images/4.jpg'
import OrbitControls from 'three-orbitcontrols'
// 场景
var scene = new THREE.Scene();
// 渲染器
var renderer = new THREE.WebGLRenderer(); 
// 相机
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
// 盒子 物体
var geometry = new THREE.BoxGeometry(50, 50, 50); 
// 背景 
let material
// 创建平面
let cube

let controls


const DemoBox = () => {

  const init = () => {
    // 
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('View').appendChild(renderer.domElement);
    // document.body.appendChild(renderer.domElement);
    let demo = new THREE.TextureLoader().load(fore)
    const faceMaterialArray = []
    // 给每个面填充不同的材质
    faceMaterialArray.push(new THREE.MeshBasicMaterial({ color:'yellow' }))
    faceMaterialArray.push(new THREE.MeshBasicMaterial({ color: 0x0051ba }))
    faceMaterialArray.push(new THREE.MeshBasicMaterial({ color: 0xffd500 }))
    faceMaterialArray.push(new THREE.MeshBasicMaterial({ color: 0xff5800 }))
    faceMaterialArray.push(new THREE.MeshBasicMaterial({ map: demo })) //正面
    faceMaterialArray.push(new THREE.MeshBasicMaterial({ color: 0xffffff }))
    material = new THREE.MeshFaceMaterial(faceMaterialArray)
    //  material = new THREE.MeshBasicMaterial({ map: demo });
    
    
    var axesHelper = new THREE.AxesHelper(150);	
    scene.add(axesHelper);	
    // 渲染器 
    // BoxGeometry 这个对象包含了一个立方体中所有的顶点（vertices）和面（faces）
    cube = new THREE.Mesh( geometry, material );
    scene.add(cube);
    camera.position.set( 0, 0, 300 );
    camera.lookAt( 0, 0, 0 );
    initControls()
  }
  

  const initControls = () => {
    controls = new OrbitControls(camera, renderer.domElement)
    

  }
  const painting = () => {
    var geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3( -10, 0, 0) );
    geometry.vertices.push(new THREE.Vector3( 0, 10, 0) );
    geometry.vertices.push(new THREE.Vector3(10, 0, 0));
    var line = new THREE.Line(geometry, material);
    scene.add( line );
  }

  
  const animate = () => {

    controls && controls.update()
    requestAnimationFrame( animate );
    renderer.render( scene, camera );
  }

  useEffect(() => {
    init()
    animate()
    painting()
    return () => {
      
    };
  }, []);


  return (
    <div>
      <div id = 'View'></div>
    </div>
  )
}

export default DemoBox