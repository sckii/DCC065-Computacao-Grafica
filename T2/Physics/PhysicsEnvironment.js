import Collision from "./Collision.js";
import * as THREE from  'three';
import { Color } from "../../build/three.module.js";

class PhysicsEnvironment {
    colliders = []; // Lista de objetos para testar a colisão
    map = []; // Os objetos dessa lista não colidem entre sí
    

    /**
     * Adiciona um collider na simulaçao de fisica.
     * @param {Collider} collider 
     */
    add(collider) {
        this.colliders.push(collider);
    }

    /**
     * Adciona um conjunto de objetos ao array *map*
     * @param {Object} blocks 
     */
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
            for (let j = 0; j < this.map.length; j++) { // para cada objeto, verificar colisão com cada bloco
                point = this.colliders[i].getClosestPointTo(this.map[j].colliderComponent.object.position);
                if (this.map[j].colliderComponent.intersctsPoint(point)) {
                    normal.add(this.map[j].colliderComponent.getCollisionNormal(point));
                    colidiuComMapa = true;
                }
                else
                    this.colliders[i].onNoCollision(this.map[j].colliderComponent);
            }

            if(colidiuComMapa){
                // Arendonda a normal para cima, baixo ou lados
                normal.normalize();
                normal.x = Math.round(normal.x);
                normal.z = Math.round(normal.z);
                normal.normalize();
                this.colliders[i].onCollision( new Collision(this.map[0], point, normal) );
            }
            
         
            if (!colidiuComMapa) { // Da priorida á colião com o mapa
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

    remove(obj) {
        const index = this.colliders.indexOf(obj);
        if (index > -1) { 
            this.colliders.splice(index, 1);
        }
    }
}

export default PhysicsEnvironment;