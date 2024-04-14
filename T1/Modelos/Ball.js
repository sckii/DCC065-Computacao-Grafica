import * as THREE from  'three';
import { Vector3 } from 'three';
import {setDefaultMaterial} from "../../libs/util/util.js";


class Ball {
    constructor(x, y, z, radius) {
        // visual
        this.x = x;
        this.y = y;
        this.z = z;
        this.radius = radius;

        // movimento
        this.dir = new Vector3(5.0, 0.0, 3.0);
        this.dir.setY(0);
        this.dir.normalize();
        this.speed = 0.2;

        this.mesh = this.buildGeometry();
    }

    buildGeometry() {
        const geometry = new THREE.SphereGeometry(this.radius,15,15); 
        const material = setDefaultMaterial("white");

        const bola = new THREE.Mesh(geometry, material);
        bola.position.set(this.x, this.y, this.z);

        return bola;
    }
    

    onCollisionEntered(other) {
        // let distance = new Vector3;
        // distance.subVectors(this.mesh.position, other.object.mesh.position);

        // this.dir.reflect(distance);
        // this.dir.normalize();
    }

    update() {

        const lerpConfig = {
            destination: new THREE.Vector3(0.0, 0.2, 0.0),
            alpha: 0.01,
            move: true
          }


          this.mesh.position.lerp(lerpConfig.destination, lerpConfig.alpha);
        //this.mesh.translateOnAxis(this.dir, this.speed);

        
        // this.mesh.translateOnAxis(this.dir, this.speed);
        // this.colliderComponent.checkWallCollision();
    }
}

export default Ball;