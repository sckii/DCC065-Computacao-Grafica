import * as THREE from  'three';
import KeyboardState from '../libs/util/KeyboardState.js';
import GUI from '../libs/util/dat.gui.module.js';
import { OrbitControls } from '../build/jsm/controls/OrbitControls.js';
import {
   initRenderer,
   initCamera,
   onWindowResize, } from "../libs/util/util.js";
import MainCamera from './Functions/MainCamera.js';
import KeyboardMovement from './Functions/KeyboardMovement.js';
import { buildLevel } from './Functions/Map.js';
import PhysicsEnvironment from './Physics/PhysicsEnvironment.js';
import deleteScene from './Functions/DeleteScene.js';
import { setScene } from './Functions/RemoveFromScene.js';

let orbit, scene, renderer, camChangeOrbit, mainCamera, secondCamera, keyboard;
scene = new THREE.Scene();
setScene(scene);

renderer = initRenderer();

// Manipulação de camera
camChangeOrbit = true; // variavel para armazenar se a camera orbital foi chamada
// alterei pra true para facilitar, mudar depois

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

scene.physics = new PhysicsEnvironment();
scene.updateList = [];
scene.tankList = [];

let actualLevel = 2; // variavel para definir o nivel atual
buildLevel(actualLevel, scene);

let n = new THREE.Vector3(1, 0, 1).normalize();
let d = new THREE.Vector3(-1, 0, 1);

d.reflect(n);

// Criar botão de reiniciar a fase
var restart = false;
var controls = new function () {
   this.restart = function () {
      restart = !restart;
   };
};
var gui = new GUI();
gui.add(controls, 'restart', true).name("Recomeçar");

mainCamera.setTracking(scene.tankList[0], scene.tankList[1]);
// definir o tacking

render();

function keyboardUpdate() {

   keyboard.update();

   // Adicionando controles aos tanque
   KeyboardMovement(scene.tankList[0], scene);
   // resolver como vai funcionar o movimento do tanque

   // Atalho para habilitar a camera secundaria (orbital)
   if (keyboard.down("O")) {
      camChangeOrbit = !camChangeOrbit;
   }

   // Atalho para mudar o nível 
   if (keyboard.down("1")) {
      actualLevel = 1;
      deleteScene(scene, scene.updateList, scene.physics);
      buildLevel(actualLevel, scene, scene.updateList, scene.physics, scene.tankList );
   }
   if (keyboard.down("2")) {
      actualLevel = 2;
      deleteScene(scene, scene.updateList, scene.physics);
      buildLevel(actualLevel, scene, scene.updateList, scene.physics, scene.tankLis );
   }
   
}

function render() {
   keyboardUpdate();
   requestAnimationFrame(render);

   scene.physics.update();

   scene.updateList.forEach(element => {
      element.update(scene);
   });

   // Botão de recomeçar a fase
   if (restart) {
      restart = false;
      deleteScene(scene, scene.updateList, scene.physics);
      buildLevel(actualLevel, scene, scene.updateList, scene.physics, scene.tankList);
   }

   // Verificando qual camera será utilizada
   if (camChangeOrbit) {
      renderer.render(scene, secondCamera) // Render scene
   }
   if (!camChangeOrbit) {
      renderer.render(scene, mainCamera.update()) // Render scene
   }
}