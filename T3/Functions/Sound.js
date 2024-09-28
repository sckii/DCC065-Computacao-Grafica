// Som quando um tiro atingir um tanque inimigo ( volume baixo);
// Som quando um tiro atingir o player (um pouco mais alto);
// Som de tiro quando qualquer tanque ou canhão (do nível 2) disparar um projétil (baixo);
// Som de movimentação dos portões ao passar de nível (baixo);
// Música do jogo, que tocará durante toda a execução do sistema (volume médio).
import * as THREE from  'three';
import { getCurrentScene } from './SceneGlobals.js';

const listener = new THREE.AudioListener();
const audioLoader = new THREE.AudioLoader();

class Sound {
  constructor(path, volume) {
    this.path = path;
    this.volume = volume;
    this.sound2 = new THREE.Audio( listener )
  }

  setSoundOff() {
    this.oldVolume = this.volume;
    this.volume = 0;

    this.sound();
  }

  setSoundOn() {
    this.volume = this.oldVolume;
    this.oldVolume = 0;

    this.sound(); 
  }

  hit() {
    this.sound();
  }

  sound() {
    const sound = this.sound2;
    const scene = getCurrentScene();

    const volume = this.volume;
    audioLoader.load(this.path, function( buffer ) {
      sound.setBuffer( buffer );
      sound.setVolume( volume );
      sound.play();
    });
    scene.mainCamera.camera.add( listener );
    sound.stop();

    return sound;
  }

  music() {
    const sound = this.sound2;
    
    const scene = getCurrentScene();
    const volume = this.volume;
    audioLoader.load(this.path, function( buffer ) {
      sound.setBuffer( buffer );
      sound.setVolume( volume );
      sound.setLoop( true );
      sound.play();
    });
    
    scene.mainCamera.camera.add( listener );
  }
}

export default Sound;