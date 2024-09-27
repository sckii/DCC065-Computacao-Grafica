import * as THREE from  'three';
import KeyboardState from '../../libs/util/KeyboardState.js';

const keyboard = new KeyboardState();

class SimplifiedCamera {
    constructor(x, y, z) {
        // Criando camera perspectiva
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        
        // Criando um camera holder para transformações envolvendo a câmera
        this.cameraHolder = new THREE.Object3D();
        this.cameraHolder.position.set(x, y, z);
        this.cameraHolder.add(this.camera)
        
        // Setando as posições da camera
        this.x = x; 
        this.y = y; 
        this.z = z;

        this.zoom = 0;
        
    }

    // Recebe obj para a camera seguir
    setTracking(tank) {
        this.tank = tank;
    }

    // Main camera
    update() {
        
        // Atualizando a camera caso altere o aspect ratio
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.cameraHolder.position.set(this.x, this.y, this.z);
        this.cameraHolder.add(this.camera)
        
        // Criando um pivot para pegar o ponto central
        const pivot = this.tank.position;
        
        // Camera Zooming
        this.changeZoom();
        const distance = this.zoom;

        // movimentação camera holder
        this.cameraHolder.position.x = pivot.x - 8;
        this.cameraHolder.position.z = pivot.z;

        // Camera e o camera holder "olhem" para o pivot
        this.cameraHolder.lookAt(pivot);
        this.camera.lookAt(pivot);

        // Zoom in e Zoom out da camera
        this.cameraHolder.translateZ(distance - 40);
        
        // Retornando o objeto camera
        return this.camera;
    }

    
    changeZoom() {
        document.addEventListener("mousewheel", (event) => {
            const scale = Math.min(Math.max(-1, event.deltaY), 1);
            this.zoom += scale * -0.01;
            this.zoom = Math.min(Math.max(-40, this.zoom), 40);
        }, false);

    }

}

export default SimplifiedCamera;