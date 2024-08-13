import * as THREE from  'three';
import { CSG } from '../../libs/other/CSGMesh.js'        
import Bullet from './Bullet.js';
import AABBCollider from '../Physics/AABBCollider.js';
import { Vector3 } from '../../build/three.module.js';

class Cannon{
    constructor(x, z){
        this.geometry = this.buildGeometry();
        this.geometry.position.set(x, 1, z);
        
        this.position = this.geometry.position;

        this.colliderComponent = new AABBCollider(this, 2.5, 2.5); 
        this.worldDir = new Vector3();
    }

    buildGeometry(){
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
        this.updateObject(subtractBox);
        
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
        this.updateObject(backSphere);

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
            this.updateObject(rim)
            csgWheel = csgWheel.union(CSG.fromMesh(rim));
        }

        let wheelL = CSG.toMesh(csgWheel, new THREE.Matrix4(), wheelMaterial);
        
        // Reposiciona
        wheelL.rotateX(THREE.MathUtils.degToRad(90));
        wheelL.position.set(0, -0.22, -0.8);

        let wheelR = wheelL.clone();
        wheelR.position.set(0, -0.22, 0.8)

    // Adciona todas as coisas em uma mesh so
        supportBox.add(barrel);
        supportBox.add(wheelL);
        supportBox.add(wheelR);
        console.log(supportBox);
        
        return supportBox;
    }

    setTracking(){      // Função pra selecionar o tanque mais próximo

    }

    rotate(){           // Função para rotacionar
        if(true)
        {
            let angle = THREE.MathUtils.degToRad(1);
            angle+=0.001;
            
            var mat4 = new THREE.Matrix4(); 
            this.geometry.rotateY(angle);
            this.geometry.matrix.multiply(mat4.makeRotationY(angle));
            this.updateObject(this.geometry)
            
        }
    }

    shoot(scene, updateList, physics){
        var shootDirection = new Vector3;
        this.geometry.getWorldDirection(shootDirection);
        shootDirection.applyAxisAngle(new Vector3(0,1,0), THREE.MathUtils.degToRad(90));

        let shootPosition = new Vector3()
        shootPosition.copy(this.position);
        const shoot = new Bullet(shootPosition, 0.25, shootDirection, this);

        scene.add(shoot.mesh);
        physics.add(shoot.colliderComponent);
        updateList.push(shoot); 
    }

    updateObject(mesh){
        mesh.matrixAutoUpdate = false;
        mesh.updateMatrix();
    }
}

export default Cannon;