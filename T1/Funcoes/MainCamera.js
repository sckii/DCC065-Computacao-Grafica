import * as THREE from  'three';

class MainCamera {
    constructor(x, y, z) {
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.cameraHolder = new THREE.Object3D();
        this.cameraHolder.position.set(x, y, z);
        this.cameraHolder.add(this.camera)

        this.x = x; 
        this.y = y; 
        this.z = z;
    }

    // Main camera
    update() {
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.cameraHolder.position.set(this.x, this.y, this.z);
        this.cameraHolder.add(this.camera)
        
        const pivot = new THREE.Vector3();
        const distance = this.calculateDistance();

        pivot.x = (this.obj_1.position.x + this.obj_2.position.x) / 2;
        pivot.y = (this.obj_1.position.y + this.obj_2.position.y) / 2;
        pivot.z = (this.obj_1.position.z + this.obj_2.position.z) / 2;

        this.cameraHolder.lookAt(pivot)

        this.cameraHolder.translateZ(8 - distance)
        this.camera.lookAt(pivot)
        
        return this.camera;
    }

    setTracking(obj_1, obj_2) {
        this.obj_1 = obj_1;
        this.obj_2 = obj_2;
    }

    rotate(angleX, angleY, angleZ) {
        this.cameraHolder.rotateX(angleX)
        this.cameraHolder.rotateY(angleY)
        this.cameraHolder.rotateZ(angleZ)
    }

    calculateDistance() {
        let dx = this.obj_1.position.x - this.obj_2.position.x;
        let dy = this.obj_1.position.y - this.obj_2.position.y;
        let dz = this.obj_1.position.z - this.obj_2.position.z;

        return Math.sqrt( dx * dx + dy * dy + dz * dz );
    }
}

export default MainCamera;