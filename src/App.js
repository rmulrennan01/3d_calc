import logo from './logo.svg';
import './App.css';
import React, { Suspense } from 'react';
import {useEffect} from 'react'; 
import * as THREE from 'three';
import {useState, useRef } from 'react';
import { Canvas, useFrame, useThree, Vector3, Box3} from '@react-three/fiber';
import { useHelper, useIntersect, Image, ScrollControls, Scroll, useScroll, Line, Html, useGLTF, MeshReflectorMaterial, Circle} from '@react-three/drei';
import { extend, useLoader } from "@react-three/fiber";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
//import * as STDLIB from 'three-stdlib'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { BasicNodeMaterial } from 'three-stdlib';
import Model from "./Model.js"; 
import { DirectionalLightHelper } from 'three';


//<Canvas orthographic camera={{ zoom: 50 }} gl={{ alpha: false, antialias: true, stencil: false, depth: false }} dpr={[1, 1.5]}> 

//dampening: higher is faster
//distance: scroll bar travel

//Dependencies
//npm install react//
//npm install three @react-three/fiber
//npm install @react-three/drei







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




function App() {
    const [display, setDisplay] = useState({previous:0.0,current:0.0 });
    const [operator, setOperator] = useState(null); 
    const [digitInputMode, setDigitInputMode] = useState(false); //true: last key press was a math operator
    const [decimalPlaces, setDecimalPlaces] = useState(0);
    const [history, setHistory] = useState([{prev:null,operator:null, current:null, answer:null }]); 

    const updateDisplay = (prev,cur) => {
        setDisplay({previous:prev, current:cur});
    }

    const updateHistory = (v1,op,v2,ans) => {
        setHistory(history.concat([{prev:v1,operator:op, current:v2, answer:ans }])); 
        //console.log("updated history"); 

    }
    const ref = useRef(); 
  const canvas_ref = useRef(); 
  //const { height, width } = useThree((state) => state.viewport); 
  
  const concatDisplay = (a) => {
        let wholeNum = 0; 
        let newNum = 0; 
        let negFactor = 1; 
        if(display.current<0){ 
            /*Due to the way we'll be multiplying current displayed values by 10, we'll need a factor to
                change negative display values to a positive value first */ 
            negFactor = -1; 
        }
        if(digitInputMode == false){ //digit entry after cleared display
            if(decimalPlaces==0){               
                updateDisplay(display.previous,a); 
            }
            else {
                updateDisplay(display.previous,(a*0.1).toFixed(1)); //toFixed must be used to correct floating point precision error
                setDecimalPlaces(decimalPlaces+1);                   
            } 
        }
        else{
            if(decimalPlaces==0){
                newNum = negFactor * display.current * 10 + a; 
                updateDisplay(display.previous,newNum * negFactor); 
            }


            else {
                wholeNum = negFactor * display.current * (10**decimalPlaces); //convert, so no decimal
                wholeNum = wholeNum + a; //shift one power of 10 and add new digit
                newNum = wholeNum * (10**(-decimalPlaces)); //convert value from wholeNum to shift decimal
                newNum = newNum.toFixed(decimalPlaces); //toFixed must be used to correct floating point precision error
                updateDisplay(display.previous,newNum * negFactor);
                setDecimalPlaces(decimalPlaces+1);                  
            } 
        }
        setDigitInputMode(true); 
    }; 

    const decimal = () => {
        if(decimalPlaces == 0){
           setDecimalPlaces(1); 
       }
    }

    const clear = () => { //clear display and operator
        updateDisplay(0,0); 
        setOperator(null); 
        setDecimalPlaces(0); 
    }

    const clearHistory = () => {
        setHistory([{prev:null,operator:null, current:null, answer:null }]); 
    }


   
    const equate = () => {
        handleMath(); 
        setDecimalPlaces(0); 
        setOperator(null); 
        setDigitInputMode(false); 
    }

    const makeNegative = () => {
        updateDisplay(display.previous, display.current*(-1))
    }

    

    const handleMath = () => {
        let tempVal = 0; 
        let prevVal = display.previous; 
        let curVal = display.current; 
        
        switch (operator) {
            case '+': 
                tempVal = Number(display.previous) + Number(display.current); 
                //Had to use Number() since adding float values was just concatting the values as strings
                updateDisplay(tempVal, tempVal);  
                
                break; 
            case '-':
            
                tempVal = Number(display.previous)-Number(display.current); 
                updateDisplay(tempVal, tempVal);  
                break; 
            case '÷':
                if(display.current==0){
                    alert("Can't Divid By Zero");
                    clear(); 
                }
                else{ 
                  
                    tempVal = Number(display.previous)/Number(display.current); 
                    updateDisplay(tempVal, tempVal);  
                }
                break;  
            case 'x':
               
                tempVal = Number(display.previous)*Number(display.current); 
                updateDisplay(tempVal, tempVal);  
                break; 
            case '^':
            
                tempVal = Number(display.previous)**Number(display.current); 
                updateDisplay(tempVal, tempVal);  
                break; 
            //case for sqrt is covered within handleoperator, as this is a more unique case. 
        }
        updateHistory(prevVal,operator,curVal,tempVal); 
        setDecimalPlaces(0);
         
    }



/*

    Calculate only if -> Operator is not null, another operator is pressed
    1. Calc only if previous press was a digit
    2. Overwrite operator if previous press was an operator. No Calculation. 
*/


    const handleOperator = (input) => {
     
        if (input == '√'){ 
            let tempCurrent= display.current
            let tempAns = Number(display.current)**(0.5);
            updateDisplay(0, tempAns); 
            setDigitInputMode(false); 
            updateHistory(null, '√', tempCurrent, tempAns); 
            setDecimalPlaces(0); 

            
        }
        
        else if(operator == null){ 
            setOperator(input); 
            
            updateDisplay(display.current,display.current); 
            setDigitInputMode(false);         
            setDecimalPlaces(0); 
        }

        else{

            if(digitInputMode == true){ 
                handleMath();  
                setOperator(input); 
                setDigitInputMode(false); 
                
            }
            else{
                setOperator(input); 
                setDecimalPlaces(0); 
            }
        }
    }
  
 
  
  
  
  
  
  
  return (
    <div className="app"> 
      <Canvas shadows ref={canvas_ref} dpr={[1, 1.5]} camera={{fov: 75, position: [0,0,5], zoom: 1, rotation:[0,Math.PI/2,0] } } > 
          <Suspense fallback={null}>
              {console.log("Canvas: ", canvas_ref.current)}
              {/*<color attach="background" args={['#191920']} /> */ }
              <Model number={concatDisplay} operator={handleOperator} displayTop={display.previous} displayBottom={display.current} clear={clear} decimal={decimal}
              
                negative={makeNegative}/> 
                
              <CameraController /> 
              
              <directionalLight position={[10, 10, 10]} intensity={2} />
              
      <Circle args={[12.75, 36, 36]} rotation-x={-Math.PI / 2} position={[0, 0, 0]}>
      {  /*blur={[400, 50]} mirror={0} mixBlur={0.75} mixStrength={10} transparent opacity={0.5} color="#555" metalness={0.95} roughness={1}
           */}   
       
      </Circle>
            




          </Suspense>
      </Canvas>
    </div> 
  );
}

export default App;
