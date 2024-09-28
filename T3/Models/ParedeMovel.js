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
        const mesh = new THREE.Mesh(geometry, this.getMaterial());
        mesh.position.set(x, y, z);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        return mesh;
    }

    getMaterial(){
        let material;
        material = new THREE.MeshPhongMaterial({
            color: "rgb(220,255,255)",
        });
        return material;
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

export default ParedeMovel;