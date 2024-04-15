import * as THREE from  'three';
import SphereCollider from '../Physics/SphereCollider.js';
import Collision from '../Physics/Collision.js';
import {setDefaultMaterial} from "../../libs/util/util.js";
import Tank from './Tank.js';
import { removerDaScene } from '../Funcoes/removerDaScene.js';


class Ball {
    constructor(position, radius, dir) {
        // visual
        this.radius = radius;
        this.mesh = this.buildMesh(position.x, 1, position.z);
        this.position = this.mesh.position;

        // movimento
        this.dir = dir;     //tiro está saindo torto mas estou mexendo nisso
        this.dir.setY(0);
        this.dir.normalize();
        this.speed = 0.2;

        // colisão
        this.colliderComponent = new SphereCollider(this, radius);  //ele só colide se tiver 1 de altura, menos ou mais ele vai pra outra direção
        this.nColisoes = 0;
    }

    buildMesh(x, y, z) {
        const geometry = new THREE.SphereGeometry(this.radius,15,15);
        const material = setDefaultMaterial("white");

        const bola = new THREE.Mesh(geometry, material);
        bola.position.set(x+3, y, z);

        return bola;
    }
    
    /**
     * Esse método é chamado quando esse objeto entra em colisão com outro.
     * @param {Collision} collision 
     */
    onCollisionEntered(collision) {
        this.nColisoes = this.nColisoes + 1;
        if (collision.other instanceof Tank){
            collision.other.vida -= 1;
            removerDaScene(this);
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
    
        //console.log(this.nColisoes);
        if (this.nColisoes >= 4 ){
                removerDaScene(this);
        }
        
        //this.colliderComponent.checkBoundCollision();
    }
}

export default Ball;