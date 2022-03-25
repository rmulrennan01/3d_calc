import logo from './logo.svg';
import './App.css';
import React, { Suspense } from 'react';
import * as THREE from 'three';
import { useRef } from 'react';
import { Canvas, useFrame,useThree} from '@react-three/fiber';
import { useIntersect, Image, ScrollControls, Scroll, useScroll, Line, Html } from '@react-three/drei';
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';


//npm install react//
//npm install three @react-three/fiber
//npm install @react-three/drei


function Model({src, scale, position}){
  const gltf = useLoader(GLTFLoader, src); 
  const ref = useRef(); 

  useFrame((state, delta) =>{
     // console.log("This is the 3d object: ", ref.current)
     //ref.current.rotate.y += 12; 
  }); 

  return(
      <>
          <primitive ref={ref} object={gltf.scene} scale={scale} position={position} /> 
          {console.log("This is the 3d object: ", ref.current)}
      </>
  )
}

function App() {
  return (
    <Canvas dpr={[1, 1.5]} camera={{fov: 75, position: [0,0,10], zoom: 1 } } shadows>
        <Suspense fallback={null}>
          <Model src={"/models/CALC.gltf"} scale={1.0} position={[7,-10,2]}/> 
          <ambientLight /> 
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} shadow-mapSize={[512, 512]} castShadow />

          

        </Suspense>
    </Canvas>  

  );
}

export default App;
