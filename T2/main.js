import KeyboardState from '../libs/util/KeyboardState.js';
import KeyboardMovement from './Functions/KeyboardMovement.js';
import { buildLevel } from './Functions/Map.js';
import { getCurrentScene, setCurrentScene, setRenderer } from './Functions/SceneGlobals.js';
import { initRenderer } from '../libs/util/util.js';
import { CSS2DRenderer } from '../build/jsm/Addons.js';
import GUI from '../libs/util/dat.gui.module.js';

let keyboard = new KeyboardState();
setRenderer(initRenderer());

const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize( window.innerWidth, window.innerHeight );
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0px';
document.body.appendChild( labelRenderer.domElement );
window.addEventListener( 'resize', () => {
   labelRenderer.setSize( window.innerWidth, window.innerHeight );
}, false );


let currentlvlNumber = 1;
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


render();
function render() {
   const scene = getCurrentScene();
   keyboardUpdate();
   requestAnimationFrame(render);   

   labelRenderer.render( scene, scene.mainCamera.camera );   

   scene.physics.update();

   scene.updateList.forEach(element => {
      element.update(scene);
   });

   // Botão de recomeçar a fase
    if (restart) {
      restart = false;
      setCurrentScene(buildLevel(currentlvlNumber));
   } 

   // Fazer verificao do nivel 1 

   // Verificando qual camera será utilizada
   if (camChangeOrbit) {
      scene.renderer.render(scene, scene.orbitCamera) // Render scene
   }
   if (!camChangeOrbit) {
      scene.renderer.render(scene, scene.mainCamera.update()) // Render scene
   }

   // Bots update 
   scene.bots.forEach(bot => {if(bot) bot.update()});
}

function keyboardUpdate() {
   const scene = getCurrentScene();
   keyboard.update();

   // Adicionando controles aos tanque
   KeyboardMovement(scene.tankList[0], scene);

   // Atalho para habilitar a camera secundaria (orbital)
   if (keyboard.down("O")) {
      camChangeOrbit = !camChangeOrbit;
   }

   // Atalho para mudar o nível 
   if (keyboard.down("1")) {
      currentlvlNumber = 1;
      setCurrentScene(buildLevel(1));
      while (labelRenderer.domElement.hasChildNodes()) {
         labelRenderer.domElement.removeChild(labelRenderer.domElement.firstChild);
      }
   }
   if (keyboard.down("2")) {
      currentlvlNumber = 2;
      setCurrentScene(buildLevel(2));
   }

   if (keyboard.down("E")) {
      console.log("e");
      while (labelRenderer.domElement.hasChildNodes()) {
         labelRenderer.domElement.removeChild(labelRenderer.domElement.firstChild);
      }
   }
}