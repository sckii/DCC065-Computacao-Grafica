/*
    Instancie essa classe no objeto que deseja ter colisão.
    A colisão é calculada pela distancia do centro do objeto.
*/

import { Vector3 } from "../../build/three.module.js";
import { worldToMatrix } from "../Funcoes/Map.js";

class SphereCollider {
    constructor(object, radious, onCollisionEntered) {
        this.object = object;
        this.radious = radious;
        this.onCollisionEntered = onCollisionEntered;
        this.isColliding = false;
    }

    /* checkCollisionWith(other) {
        if (other instanceof SphereCollider)
            this.checkCollisonWithSphere(other);
    } */

    checkCollisonWithSphere(other) {
        if (this.intersectsSphere(other)) {
            if (this.isColliding == false) {
                this.object.onCollisionEntered(other);
            }
            this.isColliding = true;
        }
        else {
            this.isColliding = false;
        }
    }

    intersectsSphere(other) {
        let distance = this.object.mesh.position.distanceTo(other.object.mesh.position);
        if (distance < this.radious + other.radious)
            return true;
        return false;
    }

    checkBoundCollision() {
        if (this.object.mesh.position.x > 10 || this.object.mesh.position.x < -10)
            this.object.dir.x = -this.object.dir.x;
        if (this.object.mesh.position.z > 10 || this.object.mesh.position.z < -10)
            this.object.dir.z = -this.object.dir.z;
    }

    /**
     * @param {int[][]} walls 
     */
    checkWallCollision(walls) {
        let pos = worldToMatrix(this.object.position);
        if (walls[pos.x][pos.y] != 0) {
            this.onCollisionEntered()
        }
    }

    /**
     * Retorna o ponto, dentro desse objeto, mais proximo de outro objeto
     * @param {Vector3} pos centro de um objeto
     */
    getClosestPointTo(pos) {
        let distance = new Vector3;
        distance.copy(this.object.mesh.position);
        distance.sub(pos);
        distance.clampLength(0,this.radious);
        
        return distance;
    }
}

export default SphereCollider;