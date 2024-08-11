import * as THREE from  'three';
import Collision from '../Physics/Collision.js';
import Bullet from './Bullet.js';

class Cannon{
    constructor(x, z){
        this.position = new THREE.Vector3(x, 0.5, z);
        this.geometry = this.buildGeometry();
    }

    buildGeometry(){
        // Constroi a roda
        let wheelMaterial = new THREE.MeshPhongMaterial({
            color: "rgb(112,66,20)",
            shininess: "100",
            specular: "rgb(255,255,255)"
         })
         
        // Geomtrias usadas 
         let bigCylinder = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 0.1, 32));
         let differenceCylinder = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 0.1, 32));
         let intercetionCylinder = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.1, 32));
         
         // Faz o aro, o centro e a roda 
         let csgHalo = CSG.fromMesh(bigCylinder).subtract(CSG.fromMesh(differenceCylinder));
         let csgCenter = CSG.fromMesh(bigCylinder).intersect(CSG.fromMesh(intercetionCylinder));
         let csgWheel = csgHalo.union(csgCenter);
         
         for (let i = 0; i < 4; i++) {
            let rim = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.05, 0.1));
            rim.rotateY(THREE.MathUtils.degToRad(i*45));
            updateObject(rim)
            csgWheel = csgWheel.union(CSG.fromMesh(rim));
         }
         
        let wheelL = CSG.toMesh(csgWheel, new THREE.Matrix4(), wheelMaterial);
        let wheelR = wheelL.clone();
                 
        // Constroi o cano
        let barrelGeometry = new THREE.CylinderGeometry(0.2, 0.2, 2.0, 32);
        let barrelMaterial = new THREE.MeshPhongMaterial({
            color: "rgb(255,66,20)",
            shininess: "200",
            specular: "rgb(255,255,255)"
        })
        const barrel = new THREE.Mesh(barrelGeometry, barrelMaterial);
        barrel.rotateZ(THREE.MathUtils.degToRad(90));        
    }
}

export default Cannon;