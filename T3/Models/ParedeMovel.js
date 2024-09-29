import * as THREE from  'three';
import AABBCollider from '../Physics/AABBCollider.js';
import { Vector3 } from '../../build/three.module.js';


class ParedeMovel {
    constructor(x,y,z, speed, dir=1) {
        this.geometry = this.buildObject(x,y,z);
        this.position = this.geometry.position;
        this.colliderComponent = new AABBCollider(this, 6, 2);
        this.initialPos = new THREE.Vector3().copy(this.position);
        this.dir = dir;
        this.speed = speed;
        this.endPos = new Vector3().copy(this.initialPos);
        this.endPos.x += 6 * dir;

        if(this.initialPos.x > this.endPos.x) {
            let aux = this.initialPos;
            this.initialPos = this.endPos;
            this.endPos = aux;
        }
    }

    buildObject(x,y,z) {
        const geometry = new THREE.BoxGeometry(6,2,2);
        let material = [
            setMaterial('./Assets/Textures/Level3/MoveWall.jpg', 1, 1, 'rgb(255,255,255)'),  // x+
            setMaterial('./Assets/Textures/Level3/MoveWall.jpg', 1, 1, 'rgb(255,255,255)'),  // x-
            setMaterial('./Assets/Textures/Level3/MoveWall.jpg', 1, 1, 'rgb(255,255,255)'),  // y+
            setMaterial('./Assets/Textures/Level3/MoveWall.jpg', 1, 1, 'rgb(255,255,255)'),  // y-
            setMaterial('./Assets/Textures/Level3/MoveWall.jpg', 1, 1, 'rgb(255,255,255)'),  // z+
            setMaterial('./Assets/Textures/Level3/MoveWall.jpg', 1, 1, 'rgb(255,255,255)'),  // z-
        ]
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(x, y, z);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        return mesh;
    }

    update() {
        if (this.position.x > this.endPos.x || this.position.x < this.initialPos.x)
            this.dir *= -1;
        this.position.setX(this.position.x + this.speed * this.dir)
    }

    onCollision(){}

    onCollisionEntered(){}

    onCollisionExit(){}
}
function setMaterial(file, repeatU = 1, repeatV = 1, color = 'rgb(255,255,255)'){
    let loader = new THREE.TextureLoader();
    let mat = new THREE.MeshLambertMaterial({ map: loader.load(file), color:color});
        mat.map.colorSpace = THREE.SRGBColorSpace;
        mat.map.wrapS = mat.map.wrapT = THREE.RepeatWrapping;
        mat.map.minFilter = mat.map.magFilter = THREE.LinearFilter;
        mat.map.repeat.set(repeatU,repeatV); 
    return mat;
}

export default ParedeMovel;