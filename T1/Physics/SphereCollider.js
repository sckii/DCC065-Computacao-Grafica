/*
    Instancie essa classe no objeto que deseja ter colisão.
    A colisão é calculada pela distancia do centro do objeto.
*/

import { Vector3 } from "../../build/three.module.js";
import { worldToMatrix } from "../Funcoes/Map.js";

class SphereCollider {
    collisions = new Set();
    constructor(object, radious) {
        this.object = object;
        this.radious = radious;
        this.isColliding = false;
    }

    /**
     * retorna _true_ se o ponto estiver dentro da esfera.
     * @param {Vector3} point 
     */
    intersctsPoint(point) {
        return this.object.mesh.position.distanceTo(point) <= this.radious;
    }

    checkBoundCollision() {
        if (this.object.mesh.position.x > 10 || this.object.mesh.position.x < -10)
            this.object.dir.x = -this.object.dir.x;
        if (this.object.mesh.position.z > 10 || this.object.mesh.position.z < -10)
            this.object.dir.z = -this.object.dir.z;
    }

    /**
     * Retorna o ponto (dentro desse objeto) mais proximo do centro de outro objeto
     * @param {Vector3} point centro de um objeto
     */
    getClosestPointTo(point) {
        let closestPoint = new Vector3;
        closestPoint.copy(point);
        closestPoint.sub(this.object.mesh.position);
        closestPoint.clampLength(0,this.radious);
        closestPoint.add(this.object.mesh.position);
        
        return closestPoint;
    }

    /**
     * @param {Collider} other 
     */
    onCollision(other) {
        if (!this.collisions.has(other)) {
            this.collisions.add(other);
            try {
                this.object.onCollisionEntered(other.object);
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