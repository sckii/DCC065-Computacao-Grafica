import * as THREE from  'three';
import KeyboardState from '../libs/util/KeyboardState.js'
import {TeapotGeometry} from '../build/jsm/geometries/TeapotGeometry.js';
import {initRenderer, 
        initDefaultSpotlight,
        createGroundPlaneXZ,
        SecondaryBox, 
        onWindowResize} from "../libs/util/util.js";

import Tank from './Modelos/Tank.js';

let scene, renderer, light, camera, keyboard;
scene = new THREE.Scene();    // Create main scene
renderer = initRenderer();    // View function in util/utils
light = initDefaultSpotlight(scene, new THREE.Vector3(5.0, 5.0, 5.0)); // Use default light    
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );
keyboard = new KeyboardState();

var groundPlane = createGroundPlaneXZ(10, 10, 40, 40); // width, height, resolutionW, resolutionH
scene.add(groundPlane);

// Create objects
const TankRed = new Tank(2.0,  0.4,  0.0, Math.random() * 0xffffff);

scene.add(TankRed)

let camPos  = new THREE.Vector3(3, 4, 8);
let camUp   = new THREE.Vector3(0.0, 1.0, 0.0);
let camLook = new THREE.Vector3(0.0, 0.0, 0.0);
var message = new SecondaryBox("");

// Main camera
camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
   camera.position.copy(camPos);
   camera.up.copy( camUp );
   camera.lookAt(camLook);

render();

function updateCamera()
{
   // DICA: Atualize a câmera aqui!

   message.changeMessage("Pos: {" + camPos.x + ", " + camPos.y + ", " + camPos.z + "} " + 
                         "/ LookAt: {" + camLook.x + ", " + camLook.y + ", " + camLook.z + "}");
}

function keyboardUpdate() {

   keyboard.update();
   
   // DICA: Insira aqui seu código para mover a câmera
            
   if ( keyboard.pressed("up") ) {
      obj.z -= 0.1;
   }

   if ( keyboard.pressed("down") ) {
      obj.z += 0.1;
   }

   if ( keyboard.pressed("left") ) {
      obj.x -= 0.1;
   }

   if ( keyboard.pressed("right") ) {
      obj.x += 0.1;
   }
   
   
   updateCamera();
}

function render()
{
   requestAnimationFrame(render);
   keyboardUpdate();
   renderer.render(scene, camera) // Render scene
}