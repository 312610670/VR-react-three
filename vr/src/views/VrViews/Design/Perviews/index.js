import React, { useMemo, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as THREE from 'three';
import {
  selectVrData,
} from '../reselect'

import {
  selectIsHotspot,
} from '../reselect'
import { actions } from '../reducers'

import { Button } from 'antd';

import fore from 'static/images/4.jpg'
import hotspot from 'static/images/hotspot.jpg'
import './index.css'


let xPositionArr = [];
let yPositionArr = [];
let zPositionArr = [];

const forType = 'Equirectangular'
let scene = new THREE.Scene();
//  1、 透视相机                        可查看视野角度            长宽比                     近截面 和远截面
let camera = new THREE.PerspectiveCamera(75, (window.innerWidth) / (window.innerHeight), 1, 1500);
/**
  *  透视相机四个参数 ：视野角度 
  *      长宽比
  *      近截面
  *      远截面
**/


let container = document.getElementById("container")
let mesh;
let arr = [];
let renderer = new THREE.WebGLRenderer({ antialias: true });
  
 // 用户交互
 let isUserInteracting = false
//  const [isUserInteracting, setIsUserInteracting] = useState(false);
 // 点击X 轴坐标
 let onPointerDownPointerX = 0
//  const [onPointerDownPointerX, setOnPointerDownPointerX] = useState(0);
 // 点击X 轴坐标
 let onPointerDownPointerY = 0 
// const [onPointerDownPointerY, setOnPointerDownPointerY] = useState(0);
let lon = 0 
let lat = 0 
  // const [lon, setLon] = useState(0);
  // const [lat, setLat] = useState(0);
let phi = 0;
let theta = 0;

let onPointerDownLon = lon
let onPointerDownLat = lat
  // const [onPointerDownLon, setOnPointerDownLon] = useState(lon);
  // const [onPointerDownLat, setOnPointerDownLat] = useState(lat);

  let isTag = false

const Preview = () => {
  
  const dispatch = useDispatch() 
  const vrData = useSelector(selectVrData())
  const isHotspot = useSelector(selectIsHotspot()) // 是否投放跳转点
  console.log(isHotspot,'---首次改变',isHotspot)

  const [width, setWidth] = useState();
  const [height, setHeight] = useState();
  const [startV, setStartV] = useState();
  
 

  // const [onPointerDownLon, setOnPointerDownLon] = useState(lon);
  // const [onPointerDownLat, setOnPointerDownLat] = useState(lat);

  useEffect(() => {
    
    init([fore])
    animate()
  }, [])
  

  //  初始化
  const init = (imgurl) => {
    let width = document.getElementById('container').getBoundingClientRect().width
    let height = document.getElementById('container').getBoundingClientRect().height
    if (imgurl.length > 1) {
      alert(
        "抱歉，一张图请选择panorama1，六张图请选择panorama6且只支持cubeFaces"
      );
      return;
    }
   
    camera.target = new THREE.Vector3(0, 0, 0);
    camera.position.set(10,0,0)
    const geometry = new THREE.SphereGeometry(500, 60, 40);
    geometry.scale(-1, 1, 1);
  

    //防止跨域用canvas作为纹理
    let canvas = document.createElement("canvas");
    canvas.style.backgroundColor = "rgba(255,255,255,0)";
    let context = canvas.getContext("2d");
    let img = new Image();
    img.src = fore;
    img.onload = function () {
      canvas.width = width;
      canvas.height = height;
      context.drawImage(img, 0, 0, width, height);
      // let texture = new THREE.Texture();
      // texture.image = canvas;
      // texture.needsUpdate = true;//开启纹理更新
      // texture.minFilter = THREE.LinearFilter;//minFilter属性：指定纹理如何缩小
      let demo = new THREE.TextureLoader().load(fore)
      let material = new THREE.MeshBasicMaterial({
        map: demo, // 此处使用 demo 的参数 图片更为清晰
        transparent: false
      });
      mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);
    };

    //画已经保存的热点
    // this.drawJumpHotSpots(this.drawedHotspots,"static/images/hotspot.jpg");
    //画已经保存的图片热点
    // this.drawImageHotSpots(this.drawedImgHotSpots);

    //判断xml字符串中的场景与目前所在场景相同的是哪一个
    // let count = -1;
    // let state = this.$store.state.test;
    // for (let i = 0; i <arr.length; i++) {
    //   if(arr[i].fileArr[0].fileUrl===state.imgFile.fileUrl[0]){
    //     count = i;
    //   }
    // }

    // if(count !== -1){
    //   //把相同场景中的热点信息commit给state
    //   let  len = arr[count].hotspot.length;

    //   for (let j = 0; j <len ; j++) {
    //     let obj={};
    //     obj.hotTarget=arr[count].hotspot[j].url.replace("{","").replace("}","").replace('node', "场景");
    //     obj.hotIntroduction=arr[count].hotspot[j].title.replace("{","").replace("}","");
    //     obj.position=arr[count].hotspot[j].position;
    //     obj.panAndTilt=arr[count].hotspot[j].panAndTilt;
    //     state.jumpHotSpots.push(obj);
    //   }
    //   let len2 = arr[count].polyhotspot.imageHotSpots.length;
    //   let len3 = arr[count].polyhotspot.urlHotSpots.length;
    //   for (let j = 0; j < len3; j++) {
    //     let obj={};
    //     let reg2 = /([^/]+)$/;
    //     obj.hotUrl=arr[count].polyhotspot.urlHotSpots[j].url.match(reg2)[1];
    //     obj.position=arr[count].polyhotspot.urlHotSpots[j].position;
    //     obj.panAndTilt=arr[count].polyhotspot.urlHotSpots[j].panAndTilt;
    //     state.urlHotSpots.push(obj);
    //   }
    //   for (let j = 0; j < len2; j++) {
    //     let obj={};
    //     let reg2 = /([^/]+)$/;
    //     obj.hotImage=arr[count].polyhotspot.imageHotSpots[j].target.match(reg2)[1];
    //     obj.position=arr[count].polyhotspot.imageHotSpots[j].position;
    //     obj.panAndTilt=arr[count].polyhotspot.imageHotSpots[j].panAndTilt;
    //     state.imageHotSpots.push(obj);
    //   }

      //当xml字符串中有场景则把场景中的热点信息进行绘制，必须判断xml字符串中的场景与目前所在场景相同才绘制热点
      //绘制xml字符串中的跳转热点
      // this.drawJumpHotSpots(arr[count].hotspot,"static/images/hotspot.jpg");
      //绘制xml字符串中的图像热点
      // this.drawImageHotSpots(arr[count].polyhotspot.imageHotSpots);
      // this.drawImageHotSpots(arr[count].polyhotspot.urlHotSpots);
    // }

    // this.$store.commit('addArr', arr);
    // renderer=new THREE.CanvasRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    //确保区域大小
    renderer.setSize(width, height);
    container = document.getElementById("container")
    container.appendChild(renderer.domElement); 

    // 当鼠标指针移动到元素上方，并按下鼠标按键（左、右键均可）
    document
      .getElementsByTagName("canvas")[0]
      .addEventListener("mousedown", onDocumentMouseDown, false);
    document
      .getElementsByTagName("canvas")[0]
      .addEventListener("mousemove", onDocumentMouseMove, false);
    document
      .getElementsByTagName("canvas")[0]
      .addEventListener("mouseup", onDocumentMouseUp, false);
    // document
    //   .getElementsByTagName("canvas")[0]
    //   .addEventListener("wheel", this.onDocumentMouseWheel, false);//wheel鼠标滚轮

    // document.getElementsByTagName("canvas")[0].addEventListener(
    //   "dragover",
    //   event => {
    //     event.preventDefault();
    //     event.dataTransfer.dropEffect = "copy";
    //   },
    //   false
    // );
    // document.getElementsByTagName("canvas")[0].addEventListener(
    //   "dragenter",
    //   () => {
    //     document.body.style.opacity = 0.5;
    //   },
    //   false
    // );
    // document.getElementsByTagName("canvas")[0].addEventListener(
    //   "dragleave",
    //   () => {
    //     document.body.style.opacity = 1;
    //   },
    //   false
    // );
    // window.addEventListener("resize", this.onWindowResize, false);
  }

  // 执行渲染
  const update = () => {
 //控制自动旋转速度
  if (isUserInteracting === false) {
        lon += 0;
      }
      lat = Math.max(-85, Math.min(85, lat));
      phi = THREE.Math.degToRad(90 - lat);
      theta = THREE.Math.degToRad(lon);//degToRad()方法返回与参数degrees所表示的角度相等的弧度值
      camera.target.x = 500 * Math.sin(phi) * Math.cos(theta);
      camera.target.y = 500 * Math.cos(phi);
      camera.target.z = 500 * Math.sin(phi) * Math.sin(theta);
      camera.lookAt(camera.target);
      renderer.render(scene, camera);
  }

  // 递归调用
  const animate = () => {
    update()
    requestAnimationFrame(animate)
  }

  //绘制多个跳转热点
  const  drawJumpHotSpots = (variable,newsrc) =>{
    for (let i = 0, len = variable.length; i < len; i++) {
      let position = variable[i].position;
      let canvas = document.createElement("canvas");
      canvas.style.backgroundColor = "rgba(255,255,255,0)";
      let context = canvas.getContext("2d");
      canvas.width = 128;
      canvas.height = 128;
      let img = new Image();
      //这里发布的时候会出现http://localhost:8083/web/dist/static/images/hotspot.jpg
      img.src = newsrc;
      //publish
      //img.src = 'textures/hotspot.jpg';
      img.onload = function() {
        context.drawImage(img, 0, 0);
        let texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;
        texture.minFilter = THREE.LinearFilter;
        var spriteMaterial = new THREE.SpriteMaterial({
          map: texture,
          transparent: false
        });
        var sprite = new THREE.Sprite(spriteMaterial);
        sprite.scale.set(30, 30, 30);
        let rate = 0.8;
        var endV = new THREE.Vector3(
          position[0] * rate,
          position[1] * rate,
          position[2] * rate
        );
        sprite.position.copy(endV);
        scene.add(sprite);
      };
    }
  }
  
  const onDocumentMouseDown = (event) => {
    isUserInteracting = true
    //首先确保imgType是auto，否则添加点击事件
    if (forType === "Equirectangular") {
        event.preventDefault();
        let vector = new THREE.Vector3(); //三维坐标对象
        vector.set(
          //注意：这里是根据render的size来确定的
          ((event.clientX - 320) / (window.innerWidth - 340)) * 2 - 1,
          -((event.clientY - 70) / (window.innerHeight - 90)) * 2 + 1,
          0.5
        );
        vector.unproject(camera);
        let raycaster = new THREE.Raycaster(
          camera.position,
          vector.sub(camera.position).normalize()//初始化
        );
        raycaster.camera=camera
        let intersects = raycaster.intersectObjects(scene.children);
      //如果绘制热点属于激活状态
      if (isTag) {
        console.log(isTag,'-----isHotspotisHotspot奇奇怪怪')
        if (intersects.length > 0) {
          var selected = intersects[0]; //取第一个物体
          setStartV(selected.point)
          xPositionArr.push(selected.point.x);
          yPositionArr.push(selected.point.y);
          zPositionArr.push(selected.point.z);
        }
        if (xPositionArr.length === 3) {
          document.getElementById("container").style.cursor = "default";
          let xAverage =
            (xPositionArr[0] + xPositionArr[1] + xPositionArr[2]) / 3;
          let yAverage =
            (yPositionArr[0] + yPositionArr[1] + yPositionArr[2]) / 3;
          let zAverage =
            (zPositionArr[0] + zPositionArr[1] + zPositionArr[2]) / 3;
          
          let canvas = document.createElement("canvas");
          canvas.style.backgroundColor = "rgba(255,255,255,0)";
          let context = canvas.getContext("2d");
          canvas.width = 128;
          canvas.height = 128;
          let img = new Image();
          //这里发布的时候会出现http://localhost:8083/web/dist/static/images/hotspot.jpg
          // img.src = "www.baidu.com/img/flexible/logo/pc/result.png";
          //发布用
          img.src = hotspot;
          img.onload = function () {
            context.drawImage(img, 0, 0,128,128);
            let texture = new THREE.Texture(canvas);
            texture.needsUpdate = true;
            texture.minFilter = THREE.LinearFilter;
            var spriteMaterial = new THREE.SpriteMaterial({
              map: texture,
              transparent: false
            });
            var sprite = new THREE.Sprite(spriteMaterial);
            sprite.scale.set(30, 30, 30);
            let rate = 0.8;
            var endV = new THREE.Vector3(
              xAverage * rate,
              yAverage * rate,
              zAverage * rate
            );
            sprite.position.copy(endV);
            scene.add(sprite);
            // dispatch(actions.changeIsHotspot())
          };

          xPositionArr = [];
          yPositionArr = [];
          zPositionArr = [];
        }
        //移除热点
      } else {
        // debugger
        if (intersects.length > 0) {
          const target = intersects[0];
          //console.log(intersects[0])
          try {
            if (target.object && target.object.type.length > 0) {
              if (target.object.type.toLowerCase() === "sprite") {
                if (this.$store.state.test.isDeleteHotSpot) {
                  scene.remove(target.object);
                  this.$store.commit("deletedHotSpot");
                  this.$store.commit("hideHotSpot");
                } else {
                  let location = target.object.position;
                  let panAndTilt = this.calculatePanandTilt(
                    location.x * 1.25,
                    location.y * 1.25,
                    location.z * 1.25
                  );
                  this.$store.commit("showJumpHotSpot");
                  this.$store.commit("saveTempLocation", {
                    location: [
                      location.x * 1.25,
                      location.y * 1.25,
                      location.z * 1.25
                    ],
                    panAndTilt: panAndTilt,
                    ID:"JumpHotSpot",
                  });

                }
              }
            }
          } catch (e) {
            console.log(e);
          }
        }
      }
    }
    onPointerDownPointerX= event.clientX
    onPointerDownPointerY = event.clientY
    onPointerDownLon = lon
    onPointerDownLat = lat
  }


  const onDocumentMouseMove = (event) => {
    if (isUserInteracting === true) {
      console.log('可以移动')
      lon = (onPointerDownPointerX - event.clientX) * 0.1 + onPointerDownLon;
      lat = (event.clientY - onPointerDownPointerY) * 0.1 + onPointerDownLat;
    }
  }

  const onDocumentMouseUp = () =>  {
    isUserInteracting = false;
  }
  const changeTag = () => {
    isTag = !isTag
    console.log(isTag)
  }
  return (
    <div className='container'>
      <Button type="primary" onClick={()=>changeTag()}>Button</Button>
      <div id="container" className="panoramaContent"></div>
    </div>
  )
}
export default Preview