import { worldToMatrix } from "../Funcoes/Map.js";
import SphereCollider from "./SphereCollider.js";

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

        for (let i = 0; i < this.colliders.length; i++) {
            for (let j = 0; j < this.map.length; j++) {
                let point = this.colliders[i].getClosestPointTo(this.map[j].colliderComponent.object.position);
                if (this.map[j].colliderComponent.intersctsPoint(point)) {
                    console.log("bat");
                    this.colliders[i].onCollision(this.map[j])
                }
                else
                    this.colliders[i].onNoCollision(this.map[j]);
            }    
        }

        // iterar por todos os objetos testando a colisão
        for (let i = 0; i < this.colliders.length; i++) {
            for (let j = i+1; j < this.colliders.length; j++) {
                let point = this.colliders[i].getClosestPointTo(this.colliders[j].object.position)
                if (this.colliders[j].intersctsPoint(point)) {
                    this.colliders[i].onCollision(this.colliders[j]);
                    this.colliders[j].onCollision(this.colliders[i]);
                }
                else {
                    this.colliders[i].onNoCollision(this.colliders[j]);
                    this.colliders[j].onNoCollision(this.colliders[i]);
                }
            }		
        }
    }

    CheckColisionWithMap(object) {
        let neighborhoodRadius = Math.ceil(object.collider.radius);
        let neighborhoodTopRightCorner = { 
            x: object.position.x - neighborhoodRadius,
            z: object.position.z - neighborhoodRadius
        }

        let matrixPosition = worldToMatrix(object.position) // posição do objeto na matriz

        if (this.mapMatrix[matrixPosition.i][matrixPosition.j] == 1) {
            object.co
        }

        /* for (let x = 0; x <= neighborhoodRadius*2; x++) {
            let i = matrixPosition.x - neighborhoodRadius + x;
            for (let z = 0; z <= neighborhoodRadius*2; z++) {
                let j = matrixPosition.z - neighborhoodRadius + z;

                if (this.mapMatrix[i][j] == 1)
            }
        } */

    }
}

export default PhysicsEnvironment;