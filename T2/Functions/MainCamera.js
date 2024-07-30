import * as THREE from  'three';

class MainCamera {
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
    }

    // Main camera
    update() {
        // Atualizando a camera caso altere o aspect ratio
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.cameraHolder.position.set(this.x, this.y, this.z);
        this.cameraHolder.add(this.camera)
        
        // Criando um pivot para pegar o ponto central
        const pivot = new THREE.Vector3();

        // Calculando a distancia entre dois objetos no espaço
        const distance = this.calculateDistance();

        // Atribuindo x, y e z do pivot como cendo o ponto central
        pivot.x = (this.obj_1.position.x + this.obj_2.position.x) / 2;
        pivot.y = (this.obj_1.position.y + this.obj_2.position.y) / 2;
        pivot.z = (this.obj_1.position.z + this.obj_2.position.z) / 2;

        // movimentação camera holder
        this.cameraHolder.position.x = ((this.obj_1.position.x + this.obj_2.position.x) / 2) - 8;
        // this.cameraHolder.position.y = 10
        this.cameraHolder.position.z = ((this.obj_1.position.z + this.obj_2.position.z) / 2);

        // Camera e o camera holder "olhem" para o pivot
        this.cameraHolder.lookAt(pivot);
        this.camera.lookAt(pivot);

        // Zoom in e Zoom out da camera
        this.cameraHolder.translateZ(6 - distance);
        
        // Retornando o objeto camera
        return this.camera;
    }

    // Recebe dois objetos para a camera seguir
    setTracking(obj_1, obj_2) {
        this.obj_1 = obj_1;
        this.obj_2 = obj_2;
    }

    // Calcula distancia entre dois objetos
    calculateDistance() {
        let dx = this.obj_1.position.x - this.obj_2.position.x;
        let dy = this.obj_1.position.y - this.obj_2.position.y;
        let dz = this.obj_1.position.z - this.obj_2.position.z;

        return Math.sqrt( dx * dx + dy * dy + dz * dz );
    }
}

export default MainCamera;