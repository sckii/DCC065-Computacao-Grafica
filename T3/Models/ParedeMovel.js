import * as THREE from  'three';
import AABBCollider from '../Physics/AABBCollider.js';


class ParedeMovel {
    constructor(x,y,z) {
        this.geometry = this.buildObject(x,y,z);
        this.position = this.geometry.position;
        this.colliderComponent = new AABBCollider(this, 6, 2);
        this.initialPos = new THREE.Vector3().copy(this.position);
        this.dir = 1;
    }

    buildObject(x,y,z) {
        const geometry = new THREE.BoxGeometry(6,2,2);
        const mesh = new THREE.Mesh(geometry, this.getMaterial());
        mesh.position.set(x, y, z);
        return mesh;
    }

    getMaterial(){
        let material;
        material = new THREE.MeshPhongMaterial({
            color: "rgb(220,255,255)",
        });
    }

    update() {
        this.position.setX(this.position.x + .1 * this.dir)
        if (this.position.x > this.initialPos.x + 6 || this.position.x < this.initialPos.x)
            this.dir *= -1;
    }

    onCollision(){}

    onCollisionEntered(){}

    onCollisionExit(){}
}

export default ParedeMovel;