import * as THREE from  'three';
import SphereCollider from '../Physics/SphereCollider.js';
import Collision from '../Physics/Collision.js';
import {setDefaultMaterial} from "../../libs/util/util.js";
import Tank from './Tank.js';
import { removeFromScene } from '../Functions/RemoveFromScene.js';


class Bullet {
    constructor(position, radius, dir, tank) {

        this.tank = tank;   // Tanque que atirou

        // Visual
        this.radius = radius;
        this.mesh = this.buildMesh(position.x, 1, position.z);
        this.position = this.mesh.position;

        // Movimento
        this.dir = dir;    
        this.dir.setY(0);
        this.dir.normalize();
        this.speed = 0.3;

        // Colisão
        this.colliderComponent = new SphereCollider(this, radius);
        this.numColision = 0;
    }

    buildMesh(x, y, z) {
        const geometry = new THREE.SphereGeometry(this.radius,15,15);
        const material = setDefaultMaterial("white");

        const bullet = new THREE.Mesh(geometry, material);
        bullet.position.set(x, y, z);

        return bullet;
    }
    
    /**
     * Esse método é chamado quando esse objeto entra em colisão com outro.
     * @param {Collision} collision 
     */
    onCollisionEntered(collision) {
        // Faz com que o tiro não bata em outros e no próprio tanque
        if(collision.other === this.tank || collision.other instanceof Bullet){     
            return;
        }
        
        this.position.add(collision.getNormal().multiplyScalar(.1));
        
        this.numColision = this.numColision + 1;
        if (collision.other instanceof Tank){
            collision.other.lifePoints -= 1;
            removeFromScene(this);
            return;
        }
        this.dir.reflect(collision.getNormal());
        this.dir.normalize();
    }

    /**
     * Esse método é chamado quando um objeto para de colidir com este
     * @param {Collider} other 
     */
    onCollisionExit(other) {
        
    }

    update() {
        this.mesh.translateOnAxis(this.dir, this.speed);
    
        //console.log(this.numColision);
        if (this.numColision >= 3 ){
            removeFromScene(this);
        }
        
        //this.colliderComponent.checkBoundCollision();
    }
}

export default Bullet;