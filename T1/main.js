import * as THREE from  'three';
import KeyboardState from '../libs/util/KeyboardState.js'
import { OrbitControls } from '../../build/jsm/controls/OrbitControls.js';
import {TeapotGeometry} from '../build/jsm/geometries/TeapotGeometry.js';
import {initRenderer, 
        initDefaultSpotlight,
        initCamera,
        createGroundPlaneXZ,
        SecondaryBox, 
        onWindowResize} from "../libs/util/util.js";

import Tank from './Modelos/Tank.js';
import MainCamera from './Funcoes/MainCamera.js';
import KeyboardMovement from './Funcoes/KeyboardMovement.js';

let orbit, scene, renderer, light, camChangeOrbit, mainCamera, secondCamera, keyboard;
scene = new THREE.Scene();    // Create main scene
renderer = initRenderer();    // View function in util/utils
light = initDefaultSpotlight(scene, new THREE.Vector3(5.0, 5.0, 5.0)); // Use default light    

// Camera Manipulation
camChangeOrbit = false;

mainCamera = new MainCamera(-10, 8, 0); // Create main camera
scene.add(mainCamera.cameraHolder)
mainCamera.rotate(THREE.MathUtils.degToRad(-30), THREE.MathUtils.degToRad(0), THREE.MathUtils.degToRad(0))

secondCamera = initCamera(new THREE.Vector3(mainCamera.x, mainCamera.y, mainCamera.z)); // Init second camera in this position
orbit = new OrbitControls( secondCamera, renderer.domElement ); // Enable mouse rotation, pan, zoom etc.

window.addEventListener( 'resize', function(){onWindowResize(mainCamera.update(), renderer)}, false );
window.addEventListener( 'resize', function(){onWindowResize(secondCamera, renderer)}, false );

// Keyboard set variable
keyboard = new KeyboardState();

var groundPlane = createGroundPlaneXZ(10, 10, 40, 40); // width, height, resolutionW, resolutionH
scene.add(groundPlane);

// Create objects
const redTank = new Tank(-3.0,  0.1,  3.0, Math.random() * 0xffffff);
const blueTank = new Tank(-3.0,  0.1,  -3.0, Math.random() * 0xffffff);

scene.add(redTank.geometry)
scene.add(blueTank.geometry)
mainCamera.setTracking(redTank.geometry, blueTank.geometry);

render();

function keyboardUpdate() {

   keyboard.update();
   
   // Enable OrbitControls
   if ( keyboard.down("O") ) {
      camChangeOrbit = !camChangeOrbit;
   }
}

function render()
{
   keyboardUpdate();
   requestAnimationFrame(render);

   KeyboardMovement(redTank.geometry);
   KeyboardMovement(blueTank.geometry, "P2");

   if (camChangeOrbit)
      renderer.render(scene, secondCamera) // Render scene

   if (!camChangeOrbit)
      renderer.render(scene, mainCamera.update()) // Render scen
}