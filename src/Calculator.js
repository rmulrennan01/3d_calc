import React, { Suspense } from 'react';
import {useEffect} from 'react'; 
import * as THREE from 'three';
import { useRef } from 'react';
import { Canvas, useFrame, useThree, Vector3, Box3} from '@react-three/fiber';
import { useHelper, useIntersect, Image, ScrollControls, Scroll, useScroll, Line, Html, useGLTF } from '@react-three/drei';
import { extend, useLoader } from "@react-three/fiber";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as STDLIB from 'three-stdlib'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { BasicNodeMaterial } from 'three-stdlib';
import Calc_model_2 from "./Calc_model_2.js"; 
import { DirectionalLightHelper } from 'three';







//<Canvas orthographic camera={{ zoom: 50 }} gl={{ alpha: false, antialias: true, stencil: false, depth: false }} dpr={[1, 1.5]}> 

//dampening: higher is faster
//distance: scroll bar travel

const CameraController = () => {
    const { camera, gl } = useThree();
    useEffect(
      () => {
        const controls = new OrbitControls(camera, gl.domElement);
  
        controls.minDistance = 1;
        controls.maxDistance = 20;
        return () => {
          controls.dispose();
        };
      },
      [camera, gl]
    );
    return null;
  }; 

function Light(){
  const light1= useRef(); 

  //useHelper(light1, DirectionalLightHelper, 'cyan')
  return (
    <directionalLight ref={light1} position={[0, 0, 20]} castShadow/>


  )

}



function Calculator() {
    const ref = useRef(); 
    const canvas_ref = useRef(); 
    //const { height, width } = useThree((state) => state.viewport); 

  return (
    <Canvas shadows ref={canvas_ref} dpr={[1, 1.5]} camera={{fov: 75, position: [0,0,10], zoom: 1 } } > 
        <Suspense fallback={null}>
            {console.log("Canvas: ", canvas_ref)}
         
        
        
      
            
            <Calc_model_2 /> 
            <ambientLight />      
            <CameraController /> 
            <Light/> 
            <directionalLight position={[10, 10, 10]} intensity={0.2} />
        </Suspense>
    </Canvas>
  )
}

export default Calculator