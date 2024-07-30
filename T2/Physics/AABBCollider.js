import { Vector3 } from "../../build/three.module.js";

class AABBCollider {
    collisions = new Set(); // Guarda as colisões correntes com esse objeto para que a colisão com um mesmo objeto não seja tratada mais de uma vez

    constructor(object, width, hight) {
        this.object = object;
        this.width = width/2;
        this.hight = hight/2;
    }
    
    /**
     * retorna _true_ se o ponto estiver dentro da esfera.
     * @param {Vector3} point 
     */
    intersctsPoint(point) {
        if (
            point.x > this.object.position.x - this.width &&
            point.x < this.object.position.x + this.width &&
            point.z > this.object.position.z - this.hight &&
            point.z < this.object.position.z + this.hight
        ) 
            return true;
    }

    /**
     * Checa a colisão com um quadrado centrado na origem
     */
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
        closestPoint.x = Math.min(Math.max(closestPoint.x, -this.width), this.width);
        closestPoint.z = Math.min(Math.max(closestPoint.z, -this.hight), this.hight);

        (closestPoint.x, this.width);
        (closestPoint.z, this.hight);
        
        closestPoint.add(this.object.position);        
        
        return closestPoint;
    }

    /**
     * @param {Collision} collision 
     */
    onCollision(collision) {
        this.object.onCollision(collision);
        if (!this.collisions.has(collision.other)) {
            this.collisions.add(collision.other);
            this.object.onCollisionEntered(collision);
        }
    }

    /**
     * @param {Collider} other 
     */
    onNoCollision(other){
        // Quando não ha colisão com um outro objeto ele é removido da lista de colisões
        // e é chamado o metodo onCollisionExit caso seja necessário tratar o fim da colisão
        if (this.collisions.has(other.object)) {
            this.collisions.delete(other.object);
            this.object.onCollisionExit(other.object);
        }
    }

    /**
     * Retorna a normal dessa superfice em um ponto
     * @param {Vector3} point 
     * @returns 
     */
    getCollisionNormal(point) {
        let normal = new Vector3().subVectors(point, this.object.position);
        if (normal.x == normal.z) {
            return normal;
        }
        
        normal.x = Math.round(normal.x);
        normal.z = Math.round(normal.z);

        normal.normalize();

        return normal;
    }
}

export default AABBCollider;