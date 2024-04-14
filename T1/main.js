import * as THREE from  'three';
import KeyboardState from '../libs/util/KeyboardState.js'
import { OrbitControls } from '../build/jsm/controls/OrbitControls.js';
import {initRenderer, 
        initDefaultSpotlight,
        initCamera,
        createGroundPlaneXZ,
        initDefaultBasicLight,
        setDefaultMaterial,
        SecondaryBox, 
        onWindowResize} from "../libs/util/util.js";

import Tank from './Modelos/Tank.js';
import MainCamera from './Funcoes/MainCamera.js';
import KeyboardMovement from './Funcoes/KeyboardMovement.js';

let orbit, scene, renderer, light, camChangeOrbit, mainCamera, secondCamera, keyboard;
scene = new THREE.Scene();
renderer = initRenderer();
light = initDefaultBasicLight(scene); // Create a basic light to illuminate the scene
//light = initDefaultSpotlight(scene, new THREE.Vector3(5.0, 5.0, 5.0));   

// Manipulação de camera
// variavel para armazenar se a camera orbital foi chamada
camChangeOrbit = true; //mudei enquanto usava

// Cria a camera main e adiciona na cena
mainCamera = new MainCamera(-10, 8, 0);
scene.add(mainCamera.cameraHolder)
window.addEventListener( 'resize', function(){onWindowResize(mainCamera.update(), renderer)}, false );

// Cria a camera secundario que terá os contres de orbita
secondCamera = initCamera(new THREE.Vector3(mainCamera.x, mainCamera.y, mainCamera.z)); // Init second camera in this position
orbit = new OrbitControls( secondCamera, renderer.domElement ); // Enable mouse rotation, pan, zoom etc.
window.addEventListener( 'resize', function(){onWindowResize(secondCamera, renderer)}, false );

// Keyboard set variable
keyboard = new KeyboardState();

var groundPlane = createGroundPlaneXZ(10, 10, 40, 40); // width, height, resolutionW, resolutionH
scene.add(groundPlane);

// Create objects
const redTank = new Tank(-3.0,  0.6,  3.0, "darkred");
const blueTank = new Tank(-3.0,  0.6,  -3.0, "navy");


scene.add(redTank.geometry)
scene.add(blueTank.geometry)
mainCamera.setTracking(redTank.geometry, blueTank.geometry);

render();

function keyboardUpdate() {

   keyboard.update();

   // Adicionando controles aos objetos
   KeyboardMovement(redTank, "P1", scene);
   KeyboardMovement(blueTank, "P2", scene);

   // Atalho para habilitar a camera secundaria (orbital)
   if ( keyboard.down("O") ) {
      camChangeOrbit = !camChangeOrbit;
   }
   
}

function render()
{
   keyboardUpdate();
   requestAnimationFrame(render);

   // Verificando qual camera será utilizada
   if (camChangeOrbit)
      renderer.render(scene, secondCamera) // Render scene

   if (!camChangeOrbit)
      renderer.render(scene, mainCamera.update()) // Render scen
}