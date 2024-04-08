import * as THREE from  'three';
import { Vector3 } from 'three';
import SphereCollider from './SphereCollider.js';

class Ball {
    constructor(x, y, z) {
        // visual
        this.mesh = this.buildMesh(x, y, z);

        // movimento
        this.dir = new Vector3().random();
        this.dir.setY(0);
        this.dir.normalize();
        this.speed = .1;

        // colisão
        this.colliderComponent = new SphereCollider(this, 1, this.onCollisionEntered);
    }

    buildMesh(x, y, z) {
        const geometry = new THREE.SphereGeometry(1,15,15);
        const material = new THREE.MeshPhongMaterial();
        material.color = new THREE.Color("rgb(0,166,32)");

        const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(x, y, z);
            mesh.castShadow = true;

        return mesh;
    }
    

    onCollisionEntered(other) {
        let distance = new Vector3;
        distance.subVectors(this.mesh.position, other.object.mesh.position);

        this.dir.reflect(distance);
        this.dir.normalize();
    }

    update() {
        this.mesh.translateOnAxis(this.dir, this.speed);
        this.colliderComponent.checkBoundCollision();
    }
}

export default Ball;