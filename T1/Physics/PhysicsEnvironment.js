class PhysicsEnvironment {
    objects = [];
    
    setMapMatrix(mapMatrix) {
        this.mapMatrix = mapMatrix;
    }

    /**
     * Adiciona um collider na simulaçao de fisica.
     * @param {Collider} collider 
     */
    add(collider) {
        this.objects.push(collider);
    }

    update() {
        for (let i = 0; i < this.objects.length; i++) {
            for (let j = i+1; j < this.objects.length; j++) {
                let point = this.objects[i].getClosestPointTo(this.objects[j].object.mesh.position)
                if (this.objects[j].intersctsPoint(point)) {
                    this.objects[i].onCollision(this.objects[j]);
                    this.objects[j].onCollision(this.objects[i]);
                }
                else {
                    this.objects[i].collisions.delete(this.objects[j]);
                    this.objects[j].collisions.delete(this.objects[i]);
                }
            }		
        }
    }
}

export default PhysicsEnvironment;