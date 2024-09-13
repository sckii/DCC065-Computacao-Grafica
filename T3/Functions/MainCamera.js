import * as THREE from  'three';
import { getCurrentScene } from './SceneGlobals.js';

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
        // Atualiza caso um tanque morra
        const scene = getCurrentScene();
        this.setTracking(scene.tankList);

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

        // camera distance calculation
        let w = window.innerWidth;
        let realDistance = -100 + w/10;

        if (realDistance > -5) {
            realDistance = -5;
        }
        if (realDistance < -100) {
            realDistance = -100;
        }
        // Zoom in e Zoom out da camera
        this.cameraHolder.translateZ(realDistance - distance);
        
        // Retornando o objeto camera
        return this.camera;
    }

    // Recebe dois objetos para a camera seguir
    setTracking(objList) {
        this.objList = objList;
    }
    // Calcula distancia entre dois objetos
    calculateCentroid() {
        this.objList = this.objList.filter(e => e);
        const centroid = new THREE.Vector3(0, 0, 0);
        this.objList.forEach(obj => {
            centroid.add(obj.position);
        });

        centroid.divideScalar(this.objList.length);
        centroid.setY(0);
        return centroid;
    }

    calculateDistance() {
        let maxDistance = 0;
        this.objList = this.objList.filter(e => e);
        const n = this.objList.length;

        for (let i = 0; i < n; i++) {
            for (let j = i + 1; j < n; j++) {
                const d = this.objList[i].position.distanceTo(this.objList[j].position);
                if (d > maxDistance) {
                    maxDistance = d;
                }
            }
        }
        return maxDistance;
    }

}

export default MainCamera;