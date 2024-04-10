import * as THREE from  'three';
import { Vector3 } from 'three';
import SphereCollider from '../Physics/SphereCollider.js';

class Ball {
    constructor(x, y, z, radious) {
        // visual
        this.mesh = this.buildMesh(x, y, z, radious);

        // movimento
        this.dir = new Vector3().random();
        this.dir.setY(0);
        this.dir.normalize();
        this.speed = .1;

        // colisão
        this.colliderComponent = new SphereCollider(this, radious);
    }

    buildMesh(x, y, z, radious) {
        const geometry = new THREE.SphereGeometry(radious,15,15);
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
        let distance = new Vector3;
        distance.subVectors(this.mesh.position, other.mesh.position);

        this.dir.reflect(distance);
        this.dir.normalize();
    }

    update() {
        this.mesh.translateOnAxis(this.dir, this.speed);
        this.colliderComponent.checkBoundCollision();
    }
}

export default Ball;