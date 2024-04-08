/*
    Instancie essa classe no objeto que deseja ter colisão.
    A colisão é calculada pela distancia do centro do objeto.
*/

class SphereCollider {
    constructor(object, radious, onCollisionEntered) {
        this.object = object;
        this.radious = radious;
        this.onCollisionEntered = onCollisionEntered;
        this.isColliding = false;
    }

    checkCollisionWith(other) {
        if (other instanceof SphereCollider)
            this.checkCollisonWithSphere(other);
    }

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

    checkWallCollision() {
        if (this.object.mesh.position.x > 10 || this.object.mesh.position.x < -10)
            this.object.dir.x = -this.object.dir.x;
        if (this.object.mesh.position.z > 10 || this.object.mesh.position.z < -10)
            this.object.dir.z = -this.object.dir.z;
    }
}

export default SphereCollider;