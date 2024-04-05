import * as THREE from  'three';

const keyboardShortcuts = {
    "w": "arrowup",
}

class Tank {
    constructor(x, y, z, color) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.color = color;

        this.geometry = this.buildGeometry();
    }

    buildGeometry(){
        const geometry = new THREE.BoxGeometry(2, 2, 2);

        const material = new THREE.MeshPhongMaterial({color: this.color, shininess:"200"});
              material.side = THREE.DoubleSide;
       
        const obj = new THREE.Mesh(geometry, material);
              obj.position.set(this.x, this.y, this.z);
              obj.castShadow = true;
    
        return obj;    
    }

    checkColision() {

    }

    update() {
        this.checkColision();
    }
}

export default Tank;