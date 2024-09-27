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

  setFatMode() {
    let newPath = this.path.replace("sounds", "fatModeSounds")
    newPath = newPath.replace("wav", "mp3")

    this.oldPath = this.path;
    this.path = newPath;

    this.sound2.stop();
    this.volume = 4
    this.music();
  }

  setFatModeOff() {
    this.path = this.oldPath;
    this.sound2.stop();
    this.volume = 0.1;
    this.music();
  }

  setSoundOff() {
    this.pause = true;
    this.sound2.stop();
  }

  setSoundOn() {
    this.sound2.play();
    this.pause = false;
  }

  hit() {
    if (!this.pause)
      this.sound();
    setTimeout(() => {
      this.sound2.stop();
    }, 10) 
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