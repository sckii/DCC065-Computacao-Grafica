import { Vector3 } from "../../build/three.module.js";

class Collision {

    /**
     * @param {Object} other 
     * @param {Vector3} point
     * @param {Vector3} normal (opcional)
     */
    constructor(other, point, normal) {
        this.other = other;
        this.point = point;
        this.normal = normal;
    }

    /**
     * Retorna a normal da colisão
     */
    getNormal() { 
        if (this.normal)
            return this.normal.normalize();
        
        return this.other.colliderComponent.getCollisionNormal(this.point);
    }    
}

export default Collision