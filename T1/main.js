import * as THREE from  'three';
import KeyboardState from '../libs/util/KeyboardState.js'
import { OrbitControls } from '../build/jsm/controls/OrbitControls.js';
import {initRenderer, 
        initCamera,
        initDefaultBasicLight,
        SecondaryBox,
        onWindowResize} from "../libs/util/util.js";

import Tank from './Modelos/Tank.js';

import MainCamera from './Funcoes/MainCamera.js';
import KeyboardMovement from './Funcoes/KeyboardMovement.js';
import { buildMap } from './Funcoes/Map.js'
import PhysicsEnvironment from './Physics/PhysicsEnvironment.js';
import { setScene } from './Funcoes/removerDaScene.js';

let orbit, scene, renderer, light, camChangeOrbit, mainCamera, secondCamera, keyboard;
scene = new THREE.Scene();
setScene(scene);

renderer = initRenderer();
light = initDefaultBasicLight(scene);

// Manipulação de camera
camChangeOrbit = false; // variavel para armazenar se a camera orbital foi chamada

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

const matrix = [
   [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
   [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
   [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
   [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
   [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
   [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
   [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
   [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
   [1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1],
   [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
   [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
   [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
   [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
   [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
   [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
   [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
   [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
 ]

scene.physics = new PhysicsEnvironment();
scene.updateList = [];
let blocks = buildMap(scene, matrix);
scene.physics.addToMap(blocks);



let n = new THREE.Vector3(1,0,1).normalize();
let d = new THREE.Vector3(-1,0,1);

d.reflect(n);

// Create objects
const redTank = new Tank(4.0,  0.7,  4.0, "darkred");
const blueTank = new Tank(4.0,  0.7,  28.0, "navy");

scene.add(redTank.geometry)
scene.physics.add(redTank.colliderComponent); 
scene.updateList.push(redTank);

scene.add(blueTank.geometry)
scene.updateList.push(blueTank);
scene.physics.add(blueTank.colliderComponent);

mainCamera.setTracking(redTank.geometry, blueTank.geometry);

render();

function keyboardUpdate() {

   keyboard.update();

   // Adicionando controles aos objetos
   KeyboardMovement(redTank, "P1", scene, scene.updateList, scene.physics);
   KeyboardMovement(blueTank, "P2", scene, scene.updateList, scene.physics);

   // Atalho para habilitar a camera secundaria (orbital)
   if ( keyboard.down("O") ) {
      camChangeOrbit = !camChangeOrbit;
   }
}


function render()
{
   keyboardUpdate();
   requestAnimationFrame(render);
   
   scene.physics.update();
   
   scene.updateList.forEach(element => {
      element.update(scene);
   });
   
      // Verificando qual camera será utilizada
      if (camChangeOrbit)
         renderer.render(scene, secondCamera) // Render scene
   
      if (!camChangeOrbit)
         renderer.render(scene, mainCamera.update()) // Render scene

}