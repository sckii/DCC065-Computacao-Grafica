/*
    Instancie essa classe no objeto que deseja ter colisão.
    A colisão é calculada pela distancia do centro do objeto.
*/

import { Vector3 } from "../../build/three.module.js";

class SphereCollider {
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
     * @param {Collider} other 
     */
    onCollision(other) {
        if (!this.collisions.has(other)) {
            this.collisions.add(other);
            try {
                this.object.onCollisionEntered(other);
            } catch (error) {
                if (error instanceof TypeError == false) {
                    throw error;
                }
            }
        }
    }

    onNoCollision(other){
        // Quando não ha colisão com um outro objeto ele é removido da lista de colisões
        // e é chamado o metodo onCollisionExit caso seja necessário tratar o fim da colisão
        if (this.collisions.has(other)) {
            this.collisions.delete(other);
            try {
                this.object.onCollisionExit(other.object);
            } catch (error) {
                if (error instanceof TypeError == false) {
                    throw error;
                }
            }
        }
    }
}

export default SphereCollider;