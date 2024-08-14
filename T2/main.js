import * as THREE from  'three';
import KeyboardState from '../libs/util/KeyboardState.js';
import GUI from '../libs/util/dat.gui.module.js';
import { OrbitControls } from '../build/jsm/controls/OrbitControls.js';
import {
   initRenderer,
   initCamera,
   initDefaultBasicLight,
   SecondaryBox,
   InfoBox,
   onWindowResize,
   degreesToRadians} from "../libs/util/util.js";
import MainCamera from './Functions/MainCamera.js';
import KeyboardMovement from './Functions/KeyboardMovement.js';
import { buildMap } from './Functions/Map.js';
import { setScene } from './Functions/RemoveFromScene.js';
import PhysicsEnvironment from './Physics/PhysicsEnvironment.js';
import Tank from './Models/Tank.js';
import Cannon from './Models/Cannon.js';
import { MathUtils } from '../build/three.module.js';



let orbit, scene, renderer, light, camChangeOrbit, mainCamera, secondCamera, keyboard;
scene = new THREE.Scene();
setScene(scene);

renderer = initRenderer();
light = initDefaultBasicLight(scene);

// Manipulação de camera
camChangeOrbit = true; // variavel para armazenar se a camera orbital foi chamada

// Cria a camera main e adiciona na cena
mainCamera = new MainCamera(0, 8, 0);
scene.add(mainCamera.cameraHolder)
window.addEventListener('resize', function () { onWindowResize(mainCamera.update(), renderer) }, false);

// Cria a camera secundario que terá os contres de orbita
secondCamera = initCamera(new THREE.Vector3(-16, 20, 16)); // Init second camera nesssa posição
orbit = new OrbitControls(secondCamera, renderer.domElement); // Habilitando mouse rotation, pan, zoom etc.

// Alterando para onde aponta a camera orbital e a secundaria
secondCamera.lookAt(11, 0, 16);
orbit.target = new THREE.Vector3(11, 0, 16);
window.addEventListener('resize', function () { onWindowResize(secondCamera, renderer) }, false);

// Keyboard set variable
keyboard = new KeyboardState();

const matrixLvl1 = [
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

const matrixLvl2 = [
   [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
   [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
   [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
   [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
   [1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
   [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
   [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
   [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
   [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
   [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
   [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
   [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
   [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
   [1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1],
   [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
   [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
   [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
   [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
]

scene.physics = new PhysicsEnvironment();
scene.updateList = [];
let blocks = buildMap(scene, matrixLvl2);
scene.physics.addToMap(blocks);

let n = new THREE.Vector3(1, 0, 1).normalize();
let d = new THREE.Vector3(-1, 0, 1);

d.reflect(n);

let cannon = new Cannon(11, 17);

scene.add(cannon.geometry);
scene.physics.add(cannon.colliderComponent); 
scene.updateList.push(cannon);

let newTank = new Tank(18, 4);
scene.add(newTank.geometry);
scene.physics.add(newTank.colliderComponent); 
scene.updateList.push(newTank);

let blueTank = new Tank(18, 30, "Blue");
scene.add(blueTank.geometry);
scene.physics.add(blueTank.colliderComponent); 
scene.updateList.push(blueTank);

let redTank = new Tank(4, 30, "Red");
scene.add(redTank.geometry);
scene.physics.add(redTank.colliderComponent); 
scene.updateList.push(redTank);

// Criar botão de reiniciar a fase
var restart = false;
var controls = new function () {
   this.restart = function () {
      restart = !restart;
   };
};
var gui = new GUI();
gui.add(controls, 'restart', true).name("Recomeçar");

let rObj = new THREE.Object3D();
mainCamera.setTracking(cannon, rObj);

render();

function keyboardUpdate() {

   keyboard.update();

   // Adicionando controles aos tanque
   KeyboardMovement(blueTank, scene, scene.updateList, scene.physics);

   // Atalho para habilitar a camera secundaria (orbital)
   if (keyboard.down("O")) {
      camChangeOrbit = !camChangeOrbit;
   }
   
   if (keyboard.pressed("C")) {
      cannon.shoot(scene, scene.updateList, scene.physics);
      cannon.rotate(1);
   }
   if (keyboard.pressed("V")) {
      cannon.rotate(-1);
   }
}

function render() {
   keyboardUpdate();
   requestAnimationFrame(render);

   scene.physics.update();

   scene.updateList.forEach(element => {
      element.update(scene);
   });

   if (restart) {
      restart = false;
      location.reload();    // Verificando se é pra recomeçar
   }

   // Verificando qual camera será utilizada
   if (camChangeOrbit) {
      renderer.render(scene, secondCamera) // Render scene
   }
   if (!camChangeOrbit) {
      renderer.render(scene, mainCamera.update()) // Render scene
   }


}