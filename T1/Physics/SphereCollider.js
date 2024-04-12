import { Vector3 } from "../../build/three.module.js";
import Collision from "./Collision.js";

class SphereCollider {
    colliders = new Set();
    collisions = new Set();
    
    constructor(object, radius) {
        this.object = object;
        this.radius = radius;
    }

    /**
     * retorna _true_ se o ponto estiver dentro da esfera.
     * @param {Vector3} point 
     */
    intersctsPoint(point) {
        return this.object.position.distanceTo(point) <= this.radius;
    }

    checkBoundCollision() {
        if (this.object.position.x > 10 || this.object.position.x < -10)
            this.object.dir.x = -this.object.dir.x;
        if (this.object.position.z > 10 || this.object.position.z < -10)
            this.object.dir.z = -this.object.dir.z;
    }

    /**
     * Retorna o ponto (dentro desse objeto) mais proximo do centro de outro objeto
     * @param {Vector3} point centro de um objeto
     */
    getClosestPointTo(point) {
        let closestPoint = new Vector3;
        closestPoint.copy(point);
        closestPoint.sub(this.object.position); // Vetor que aponta deste objeto para o outro objeto
        closestPoint.clampLength(0,this.radius);
        closestPoint.add(this.object.position);
        
        return closestPoint;
    }

    /**
     * @param {Collision} collision 
     */
    onCollision(collision) {
        if (!this.colliders.has(collision.other)) {
            this.colliders.add(collision.other);
            this.object.onCollisionEntered(collision);
        }
    }

    /**
     * 
     * @param {Collider} other 
     */
    onNoCollision(other){
        // Quando não ha colisão com um outro objeto ele é removido da lista de colisões
        // e é chamado o metodo onCollisionExit caso seja necessário tratar o fim da colisão
        if (this.colliders.has(other.object)) {
            this.colliders.delete(other.object);
            this.object.onCollisionExit(other.object);
        }
    }

    getCollisionNormal(point) {
        return new Vector3().subVectors(point, this.object.position).normalize();
    }
}

export default SphereCollider;