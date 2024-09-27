import KeyboardState from '../libs/util/KeyboardState.js';
import KeyboardMovement from './Functions/KeyboardMovement.js';
import { buildLevel } from './Functions/Map.js';
import { getCurrentScene, setCurrentScene, setRenderer } from './Functions/SceneGlobals.js';
import { initRenderer, SecondaryBox } from '../libs/util/util.js';
import { CSS2DRenderer, CSS2DObject } from '../build/jsm/Addons.js';
import GUI from '../libs/util/dat.gui.module.js';
import deleteScene from './Functions/DeleteScene.js';
import Sound from './Functions/Sound.js';

let keyboard = new KeyboardState();
setRenderer(initRenderer());

let cssRenderer = initCssRenderer();

let currentlvlNumber = 3;
setCurrentScene(buildLevel(currentlvlNumber));


// Criar botão de reiniciar a fase
var restart = false;
var controls = new function () {
   this.restart = function () {
      restart = !restart;
   };
};
var gui = new GUI();
gui.add(controls, 'restart', true).name("Recomeçar");

// Manipulação de camera
let camChangeOrbit = false; // variavel para armazenar se a camera orbital foi chamada

// Controle god mod
let isGodModOn = false;
let godModMsg;

let isFatModOn = false;
let fatModMsg;

let playing = false;
const musica = new Sound("./Assets/sounds/music.wav", 0.1);

render();
function render() {
   const scene = getCurrentScene();
   keyboardUpdate();
   requestAnimationFrame(render);   

   scene.physics.update();
   scene.mainCamera.update(scene.tankList)
   scene.updateList.forEach(element => {
      element.update(scene);
   });

   // Botão de recomeçar a fase
   if (restart) {
      restart = false;
      clearCssRenderer();
      setCurrentScene(buildLevel(currentlvlNumber));
   } 

   if (!playing) {
      musica.music();
   }
   playing = true;

   // Caso o player morra
   if(scene.playerTank.isDead){
      clearCssRenderer();
      setCurrentScene(buildLevel(currentlvlNumber));
   }

   // Passar de fase
   if(currentlvlNumber == 1 && getCurrentScene().bots.length == 0){
      currentlvlNumber = 2;
      clearCssRenderer();
      setCurrentScene(buildLevel(2));
   }
   if(currentlvlNumber == 2 && getCurrentScene().bots.length == 0){
      currentlvlNumber = 3;
      clearCssRenderer();
      setCurrentScene(buildLevel(currentlvlNumber));
   }
   if(currentlvlNumber == 3 && getCurrentScene().bots.length == 0){
      currentlvlNumber = 3;
      clearCssRenderer();
      setCurrentScene(buildLevel(currentlvlNumber));
   }


   // Verificando qual camera será utilizada
   if (camChangeOrbit) {
      scene.renderer.render(scene, scene.orbitCamera) // Render scene
      cssRenderer.render( scene, scene.orbitCamera );   
   }
   if (!camChangeOrbit) {
      scene.renderer.render(scene, scene.mainCamera.update()) // Render scene
      cssRenderer.render( scene, scene.mainCamera.camera );   
   }

   // Bots update 
   scene.bots.forEach(bot => {if(bot) bot.ai.update()});
}

function keyboardUpdate() {
   const scene = getCurrentScene();
   keyboard.update();

   // Adicionando controles aos tanque
   KeyboardMovement(scene.playerTank, scene);

   // Atalho para habilitar a camera secundaria (orbital)
   if (keyboard.down("O")) {
      camChangeOrbit = !camChangeOrbit;
   }

   if (keyboard.down("G")) {
      isGodModOn = !isGodModOn;
      if(isGodModOn){
         scene.playerTank.godMod = true
         godModMsg = new SecondaryBox("God Mod on")
      }
      else{
         scene.playerTank.godMod = false
         godModMsg.hide()
      }
   }

   if (keyboard.down("F")) {
      isFatModOn = !isFatModOn;
      if(isFatModOn){
         fatModMsg = new SecondaryBox("Fat Mod on")
         musica.setFatMode()
      }
      else{
         musica.setFatModeOff();
         fatModMsg.hide()
      }
      scene.tankList.forEach(tank => {
         tank.fatMod(isFatModOn)
      });
   }

   // Atalho para mudar o nível 
   if (keyboard.down("1")) {
      currentlvlNumber = 1;
      clearCssRenderer();
      setCurrentScene(buildLevel(1));
   }
   if (keyboard.down("2")) {
      currentlvlNumber = 2;
      clearCssRenderer();
      setCurrentScene(buildLevel(2));
   }
   if (keyboard.down("3")) {
      console.log("oi");
      currentlvlNumber = 3;
      clearCssRenderer();
      setCurrentScene(buildLevel(3));
   }

}

function clearCssRenderer() {  
   getCurrentScene().traverse(child => {
      if (child instanceof CSS2DObject) {
         child.element.remove(); // Remove the DOM element
         if (child.children && child.children.length > 0) {
            child.parent.remove(child); // Remove the 3D object
         }
      }
   });
   cssRenderer.domElement.remove();
   deleteScene(getCurrentScene());
   cssRenderer = initCssRenderer();
}

function initCssRenderer() {
   const cssRenderer = new CSS2DRenderer();
   cssRenderer.setSize( window.innerWidth, window.innerHeight );
   cssRenderer.domElement.style.position = 'absolute';
   cssRenderer.domElement.style.top = '0px';
   document.body.appendChild( cssRenderer.domElement );
   cssRenderer.domElement.style.pointerEvents = 'none'
   window.addEventListener( 'resize', () => {
      cssRenderer.setSize( window.innerWidth, window.innerHeight );
   }, false );
   return cssRenderer;
}