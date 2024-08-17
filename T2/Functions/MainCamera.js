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
        const pivot = this.calculateCentroid();

        // Calculando a distancia entre dois objetos no espaço
        const distance = this.calculateDistance();

        // movimentação camera holder
        this.cameraHolder.position.x = pivot.x - 8;
        this.cameraHolder.position.z = pivot.z;

        // Camera e o camera holder "olhem" para o pivot
        this.cameraHolder.lookAt(pivot);
        this.camera.lookAt(pivot);

        // Zoom in e Zoom out da camera
        this.cameraHolder.translateZ(distance - 18);
        
        // Retornando o objeto camera
        return this.camera;
    }

    // Recebe dois objetos para a camera seguir
    setTracking(objList) {
        this.objList = objList;
    }
    // Calcula distancia entre dois objetos
    calculateCentroid() {
        const centroid = new THREE.Vector3(0, 0, 0);
        this.objList.forEach(obj => {
            centroid.add(obj.position);
        });

        centroid.divideScalar(this.objList.length);
        centroid.setY(0);
        return centroid;
    }

    calculateDistance() {
        let totalDistance = 0;

        for (let i = 0; i < this.objList.length - 1; i++) {
            totalDistance += this.objList[i].position.distanceTo(this.objList[i + 1].position);
        }
    
        return -totalDistance;
    }

}

export default MainCamera;