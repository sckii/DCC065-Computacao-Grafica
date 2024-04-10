import * as THREE from  'three';
import { Vector3 } from 'three';
import SphereCollider from '../Physics/SphereCollider.js';

class Ball {
    constructor(x, y, z, radius) {
        // visual
        this.mesh = this.buildMesh(x, y, z, radius);
        this.position = this.mesh.position;

        // movimento
        this.dir = new Vector3().random();
        this.dir.setY(0);
        this.dir.normalize();
        this.speed = .1;

        // colisão
        this.colliderComponent = new SphereCollider(this, radius);
    }

    buildMesh(x, y, z, radius) {
        const geometry = new THREE.SphereGeometry(radius,15,15);
        const material = new THREE.MeshPhongMaterial();
        material.color = new THREE.Color("rgb(0,166,32)");

        const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(x, y, z);
            mesh.castShadow = true;

        return mesh;
    }
    
    /**
     * Método chamado quando esse objeto entra em colisão com outro.
     * @param {Object} other 
     */
    onCollisionEntered(other) {
        let vecDistance = new Vector3;
        vecDistance.subVectors(this.mesh.position, other.position);

        this.dir.reflect(vecDistance);
        this.dir.normalize();
    }

    update() {
        this.mesh.translateOnAxis(this.dir, this.speed);
        //this.colliderComponent.checkBoundCollision();
    }
}

export default Ball;