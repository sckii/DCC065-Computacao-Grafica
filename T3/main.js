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

setupLoadingScreen()

let cssRenderer;

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

// Controle god mod
let isGodModOn = false;
let godModMsg;

let isFatModOn = false;
let fatModMsg;

let soundOn = true;


// Sons 
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
      currentlvlNumber = 0;
      clearCssRenderer();
      showEndScreen();
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

   if (keyboard.down("P")) {
      if (soundOn) {
         Object.keys(scene.sounds).forEach(key => scene.sounds[key].setSoundOff())
         musica.setSoundOff();
      }
      else {
         Object.keys(scene.sounds).forEach(key => scene.sounds[key].setSoundOn())
         musica.setSoundOn();
      }
      soundOn = !soundOn;
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
// Configura a tela de carregamento
function setupLoadingScreen() {
   let progressBar = document.getElementById('progress');
   let button = document.getElementById("startBtn");
   // Inicialmente, o botão é desabilitado e exibe "Carregando..."
   button.disabled = true;
   button.style.backgroundColor = 'red';
   button.innerHTML = 'Carregando...';
   let progressWidth = 0;
 
   // Simula o preenchimento da barra de progresso ao longo de 3 segundos
   let progressInterval = setInterval(() => {
     if (progressWidth >= 100) {
      clearInterval(progressInterval);
       // Adiciona um pequeno delay para garantir que a barra esteja visualmente completa
      setTimeout(() => {
            // Quando o "carregamento" termina, o botão se torna clicável
            button.disabled = false;
            button.style.backgroundColor = '#4caf50';  // Torna o botão verde
            button.innerHTML = 'Começar o Jogo';  // Muda o texto
   
            button.addEventListener("click", onButtonPressed);
         }, 2300);  // Delay após a barra encher
      } else {
         progressWidth += 10;  // Aumenta a barra de progresso gradualmente
         progressBar.style.width = progressWidth + '%';
      }
   }, 1);  // A cada 1ms, a barra aumenta de largura
 
   // Configura o botão de começar
   button.addEventListener("click", onButtonPressed);
}
 // Função para ocultar a tela de carregamento e iniciar o jogo
function onButtonPressed() {
   const loadingScreen = document.getElementById('loading-screen');
   loadingScreen.classList.add('fade-out');  // Inicia o fade-out da tela de carregamento
 
   // Remove a tela de carregamento após a transição
   loadingScreen.addEventListener('transitionend', (e) => {
     const element = e.target;
     element.remove();  // Remove a tela de carregamento da DOM
   });

   musica.music();
   cssRenderer = initCssRenderer();
 }

// Função para mostrar a tela de fim de jogo
function showEndScreen() {
   const endScreen = document.getElementById('end-screen');
   endScreen.classList.remove('hidden');  // Remove a classe que oculta a tela
   endScreen.classList.add('visible');    // Adiciona a classe para o fade-in e tornar visível
 
   const restartButton = document.getElementById('restartBtn');
   restartButton.addEventListener('click', restartGame);  // Configura o botão para reiniciar o jogo
}

// Função para reiniciar o jogo (sem recarregar a página)
function restartGame() {
const endScreen = document.getElementById('end-screen');

// Remove a classe "visible" e adiciona "fade-out"
endScreen.classList.remove('visible');
endScreen.classList.add('fade-out');

// Remove a tela de fim de jogo após a transição de fade-out
endScreen.addEventListener('transitionend', (e) => {
   if (e.target === endScreen) {  // Verifica se a transição é na tela de fim
      endScreen.classList.add('hidden');  // Oculta a tela novamente
      endScreen.classList.remove('fade-out');  // Remove o fade-out para que possa ser reutilizado depois
      resetGame();  // Chama a função para reiniciar o estado do jogo
   }
}, { once: true });  // Garante que o evento transitionend seja chamado apenas uma vez
}

function resetGame(){
   currentlvlNumber = 1;
   restart = true;
}