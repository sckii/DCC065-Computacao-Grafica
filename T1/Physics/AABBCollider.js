import { Vector3 } from "../../build/three.module.js";

class AABBCollider {
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

    getClosestPointTo(point) {
        let closestPoint = new Vector3;
        closestPoint.copy(point);
        closestPoint.sub(this.object.position); // Vetor que aponta deste objeto para o outro objeto
        closestPoint.x = Math.max(closestPoint.x, this.width);
        closestPoint.z = Math.max(closestPoint.z, this.hight);

        closestPoint.add(this.object.position);        
        return closestPoint;
    }
}

export default AABBCollider;