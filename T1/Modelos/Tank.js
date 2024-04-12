import * as THREE from  'three';
import {setDefaultMaterial} from "../../libs/util/util.js";


class Tank {
    constructor(x, y, z, color) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.color = color;

        this.geometry = this.buildGeometry();
    }

    buildGeometry(){

        //cria a box inicial
        const geometry = new THREE.BoxGeometry(2.5, 0.75, 1.7);
        //const material = new THREE.MeshPhongMaterial({color: this.color, shininess:"200"});
        //    material.side = THREE.DoubleSide;
        const material = setDefaultMaterial(this.color);
        const obj = new THREE.Mesh(geometry, material);
            obj.position.set(this.x, this.y, this.z);
            obj.castShadow = true;
          
        //cria rodas
        //const materialRoda = new THREE.MeshPhongMaterial({color: "grey", shininess:"50"});
        const materialRoda = setDefaultMaterial("grey");
        const geometryRoda = new THREE.CylinderGeometry(0.4, 0.4, 0.5, 32); 
        geometryRoda.rotateX(THREE.MathUtils.degToRad(90));
        geometryRoda.castShadow = true;
            // Frente esquerda
            const rodaFE = new THREE.Mesh(geometryRoda, materialRoda);
            rodaFE.position.set(0.75, -0.1, -0.8);
            rodaFE.castShadow = true;
            obj.add(rodaFE);
            //Meio esquerda
            const rodaME = new THREE.Mesh(geometryRoda, materialRoda);
            rodaME.position.set(0.0, -0.1, -0.8);
            rodaME.castShadow = true;
            obj.add(rodaME);
            //Traseira esquerda
            const rodaTE = new THREE.Mesh(geometryRoda, materialRoda);
            rodaTE.position.set(-0.75, -0.1, -0.8);
            rodaTE.castShadow = true;
            obj.add(rodaTE);
            //Frente direita
            const rodaFD = new THREE.Mesh(geometryRoda, materialRoda);
            rodaFD.position.set(0.75, -0.1, 0.8);
            rodaFD.castShadow = true;
            obj.add(rodaFD);
            //Meio direita
            const rodaMD = new THREE.Mesh(geometryRoda, materialRoda);
            rodaMD.position.set(0.0, -0.1, 0.8);
            rodaMD.castShadow = true;
            obj.add(rodaMD);
            //Traseira direita
            const rodaTD = new THREE.Mesh(geometryRoda, materialRoda);
            rodaTD.position.set(-0.75, -0.1, 0.8);
            rodaTD.castShadow = true;
            obj.add(rodaTD);

        //cria a parte de cima
        const geometryCima = new THREE.SphereGeometry(0.75, 32, 32);
        const cima = new THREE.Mesh(geometryCima, material);
        cima.castShadow = true;
        cima.position.set(-0.4, 0.4, 0.0);
        obj.add(cima);

        //cria o cano
        const geometryCano = new THREE.CylinderGeometry(0.25, 0.25, 2.0, 32);
        const cano = new THREE.Mesh(geometryCano, material);
        cano.rotateZ(THREE.MathUtils.degToRad(90));
        cano.position.set(1.0, 0.4, 0.0)
        cima.add(cano);

        return obj;    
    }

    checkColision() {

    }

    update() {
        

    }        

}

export default Tank;