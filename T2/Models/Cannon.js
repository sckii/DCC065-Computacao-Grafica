import * as THREE from  'three';
import Collision from '../Physics/Collision.js';
import Bullet from './Bullet.js';

class Cannon{
    constructor(x, z,scene){
        //this.position = new THREE.Vector3(x, 1, z);
        console.log("hi")
        this.geometry = this.buildGeometry(scene);
    }

    buildGeometry(scene){
    // Constroi a caixa inicial
        let boxMaterial = new THREE.MeshPhongMaterial({
            color: "rgb(17,17,17)",
            shininess: "200",
            specular: "rgb(255,255,255)"
        })
        // Geometrias usadas
        let mainBox = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1, 1.5));
        let subtractBox = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.5, 1));
        subtractBox.position.set(0, 0.25, 0);
        updateObject(subtractBox);
        
        // Remove uma parte da caixa principal
        let csgSupportBox = CSG.fromMesh(mainBox).subtract(CSG.fromMesh(subtractBox));
        let supportBox = CSG.toMesh(csgSupportBox, new THREE.Matrix4(), boxMaterial);
            
    // Cria o cano
        let barrelMaterial = new THREE.MeshPhongMaterial({
        color: "rgb(46,46,46)",
        shininess: "200",
        specular: "rgb(255,255,255)"
        })
        // Geometrias usadas
        let mainCylinder = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.4, 2.5, 32));
        let backSphere = new THREE.Mesh(new THREE.SphereGeometry(0.5,32,32));
        let subtractCylinder =new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 2.5, 32));
        backSphere.position.set(0, 1.25, 0);
        updateObject(backSphere);

        // Une o cano com a parte de tras e remove o miolo
        let csgBarrel = CSG.fromMesh(mainCylinder).union(CSG.fromMesh(backSphere));
        csgBarrel = csgBarrel.subtract(CSG.fromMesh(subtractCylinder));
        let barrel = CSG.toMesh(csgBarrel, new THREE.Matrix4, barrelMaterial);

        // Reposiciona
        barrel.rotateZ(THREE.MathUtils.degToRad(90));
        barrel.position.set(0.4, 0.4, 0); 

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
        
        // Cria e adiciona os raios da roda
        for (let i = 0; i < 4; i++) {
            let rim = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.05, 0.1));
            rim.rotateY(THREE.MathUtils.degToRad(i*45));
            updateObject(rim)
            csgWheel = csgWheel.union(CSG.fromMesh(rim));
        }

        let wheelL = CSG.toMesh(csgWheel, new THREE.Matrix4(), wheelMaterial);
        let wheelR = wheelL.clone();
        
        // Reposiciona
        wheelL.rotateX(THREE.MathUtils.degToRad(90));
        wheelL.position.set(0, -0.22, -0.8);
        wheelR.position.set(0, -0.22, 0.8)

    // Adciona todas as coisas em uma mesh so
        supportBox.add(barrel);
        supportBox.add(wheelL);
        supportBox.add(wheelR);
        scene.add(supportBox);
        return supportBox;
    }

    setTracking(){      // Função pra selecionar o tanque mais próximo

    }

    rotate(){           // Função para rotacionar
        
    }
}

export default Cannon;