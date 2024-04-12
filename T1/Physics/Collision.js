import { Vector3 } from "../../build/three.module.js";

class Collision {

    /**
     * @param {Object} other 
     * @param {Vector3} point
     * @param {Vector3} normal
     */
    constructor(other, point, normal) {
        this.other = other;
        this.point = point;
        this.normal = normal;
    }

    getNormal() { 
        if (this.normal)
            return this.normal;
        
        return this.other.colliderComponent.getCollisionNormal(this.point);
    }    
}

export default Collision