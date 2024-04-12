import Collision from "./Collision.js";
import * as THREE from  'three';
import { Color } from "../../build/three.module.js";

class PhysicsEnvironment {
    colliders = [];
    map = [];
    
    setMapMatrix(mapMatrix) {
        this.mapMatrix = mapMatrix;
    }

    /**
     * Adiciona um collider na simulaçao de fisica.
     * @param {Collider} collider 
     */
    add(collider) {
        this.colliders.push(collider);
    }

    addToMap(blocks) {
        blocks.forEach(element => {
            this.map.push(element);
        });
    }

    update() {
        // iterar por todos os objetos testando a colisão
        for (let i = 0; i < this.colliders.length; i++) {
            let colidiuComMapa = false;

            let normal = new THREE.Vector3(0,0,0);
            let point;
            for (let j = 0; j < this.map.length; j++) {
                point = this.colliders[i].getClosestPointTo(this.map[j].colliderComponent.object.position);
                if (this.map[j].colliderComponent.intersctsPoint(point)) {
                    normal.add(this.map[j].colliderComponent.getNormal(point));
                    colidiuComMapa = true;
                }
                else
                    this.colliders[i].onNoCollision(this.map[j].colliderComponent);
            }
            this.colliders[i].onCollision( new Collision(this.map[0], point, normal.normalize()) );
         
            if (!colidiuComMapa) {
                for (let j = i+1; j < this.colliders.length; j++) {
                    let point = this.colliders[i].getClosestPointTo(this.colliders[j].object.position)
                    if (this.colliders[j].intersctsPoint(point)) {
                        this.colliders[i].onCollision( new Collision(this.colliders[j].object, point));
                        this.colliders[j].onCollision( new Collision(this.colliders[i].object, point));
                    }
                    else {
                        this.colliders[i].onNoCollision(this.colliders[j]);
                        this.colliders[j].onNoCollision(this.colliders[i]);
                    }
                }		
            }
        }
    }
}

export default PhysicsEnvironment;