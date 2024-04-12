import { Vector3 } from "../../build/three.module.js";

class Collision {

    /**
     * @param {Object} other 
     * @param {Vector3} point 
     */
    constructor(other, point) {
        this.other = other;
        this.point = point;
    }

    getNormal() {
        return this.other.colliderComponent.getCollisionNormal(this.point);
    }
    
}

export default Collision