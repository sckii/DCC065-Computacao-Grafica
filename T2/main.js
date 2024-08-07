import * as THREE from  'three';
import KeyboardState from '../libs/util/KeyboardState.js'
import GUI from '../libs/util/dat.gui.module.js'
import { OrbitControls } from '../build/jsm/controls/OrbitControls.js';
import {initRenderer, 
        initCamera,
        initDefaultBasicLight,
        SecondaryBox,
        InfoBox,
        onWindowResize,
        degreesToRadians} from "../libs/util/util.js";
import Tank from './Models/Tank.js';                                
import MainCamera from './Functions/MainCamera.js';
import KeyboardMovement from './Functions/KeyboardMovement.js';
import { buildMap } from './Functions/Map.js'
import { setScene } from './Functions/RemoveFromScene.js';
import PhysicsEnvironment from './Physics/PhysicsEnvironment.js';
import { GLTFLoader } from '../build/jsm/loaders/GLTFLoader.js';
import NewTank from './Models/NewTank.js';

let orbit, scene, renderer, light, camChangeOrbit, mainCamera, secondCamera, keyboard;
scene = new THREE.Scene();
setScene(scene);

renderer = initRenderer();
light = initDefaultBasicLight(scene);

// Manipulação de camera
camChangeOrbit = false; // variavel para armazenar se a camera orbital foi chamada

// Cria a camera main e adiciona na cena
mainCamera = new MainCamera(0, 8, 0);
scene.add(mainCamera.cameraHolder)
window.addEventListener( 'resize', function(){onWindowResize(mainCamera.update(), renderer)}, false );

// Cria a camera secundario que terá os contres de orbita
secondCamera = initCamera(new THREE.Vector3(-16, 20, 16)); // Init second camera nesssa posição
orbit = new OrbitControls( secondCamera, renderer.domElement ); // Habilitando mouse rotation, pan, zoom etc.

// Alterando para onde aponta a camera orbital e a secundaria
secondCamera.lookAt(11, 0, 16);  
orbit.target = new THREE.Vector3(11, 0, 16);
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

// Define as possíveis cores dos tanques
const newTank = new NewTank(4.0,  0.0,  4.0, scene);
const redTank = new Tank(4.0,  0.7,  4.0 );
const blueTank = new Tank(4.0,  0.7,  28.0);

// Adiciona eles a cena, a física e a lista de update
scene.add(redTank.geometry)
scene.physics.add(redTank.colliderComponent); 
scene.updateList.push(redTank);

scene.add(blueTank.geometry)
scene.updateList.push(blueTank);
scene.physics.add(blueTank.colliderComponent);

// Criar botão de reiniciar a fase
var restart = false;
var controls = new function ()
  {
    this.restart = function(){
      restart = !restart;
    };
  };
var gui = new GUI();
gui.add(controls, 'restart', true).name("Recomeçar");

mainCamera.setTracking(redTank.geometry, blueTank.geometry);

render();

function keyboardUpdate() {

   keyboard.update();

   // Adicionando controles aos tanque
   KeyboardMovement(redTank, scene, scene.updateList, scene.physics);

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

   if(restart) {
      restart = false;
      location.reload();    // Verificando se é pra recomeçar
   } 
   
   // Verificando qual camera será utilizada
   if (camChangeOrbit){
      renderer.render(scene, secondCamera) // Render scene
   }
   if (!camChangeOrbit){
      renderer.render(scene, mainCamera.update()) // Render scene
   }


}