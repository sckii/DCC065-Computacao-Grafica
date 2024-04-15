import * as THREE from  'three';
import {setDefaultMaterial} from "../../libs/util/util.js";
import Ball from './Ball.js';
import AABBCollider from '../Physics/AABBCollider.js';
import GameOver from '../Funcoes/GameOver.js';


class Tank {
    constructor(x, y, z, color ) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.color = color;

        this.geometry = this.buildGeometry();
        this.position = this.geometry.position;

        this.colliderComponent = new AABBCollider(this, 2, 2);
        this.vida = 10;
    }

    buildGeometry(){

        //cria a box inicial

        const geometry = new THREE.BoxGeometry(2.5, 0.5, 1.7);
        const material = setDefaultMaterial(this.color);
        const caixa = new THREE.Mesh(geometry, material);
            caixa.position.set(this.x, this.y, this.z);
            caixa.castShadow = true;
          
        //cria rodas
        const materialRoda = setDefaultMaterial("black");
        const geometryRoda = new THREE.CylinderGeometry(0.4, 0.4, 0.5, 32); 
        geometryRoda.rotateX(THREE.MathUtils.degToRad(90));

        for (let z = -0.65; z<=0.65; z = z + 1.3){
            for(let x = -0.75; x<=0.75; x = x + 0.75){      //cria rodas esquerdas
                let roda = new THREE.Mesh(geometryRoda, materialRoda);
                roda.position.set(x, -0.3, z);
                caixa.add(roda);
            } 
        }
   
        //cria a parte de cima
        const geometryCima = new THREE.SphereGeometry(0.75, 32, 32);
        const cima = new THREE.Mesh(geometryCima, material);
        cima.castShadow = true;
        cima.position.set(-0.4, 0.3, 0.0);
        caixa.add(cima);

        //cria o cano
        const geometryCano = new THREE.CylinderGeometry(0.2, 0.2, 2.0, 32);
        const cano = new THREE.Mesh(geometryCano, material);
        cano.rotateZ(THREE.MathUtils.degToRad(90));
        cano.position.set(1.0, 0.4, 0.0)
        cima.add(cano);

        return caixa;    
    }

    shoot(scene, updateList, physics){

        var direcaoTiro = new THREE.Vector3(0, 0, -1);
        this.geometry.getWorldDirection(direcaoTiro);

        const tiro = new Ball(this.position, 0.25, direcaoTiro);

        scene.add(tiro.mesh);
        physics.add(tiro.colliderComponent);   
        updateList.push(tiro); 
    }

    /**
     * Esse método é chamado quando esse objeto entra em colisão com outro.
     * @param {Collision} collision 
     */
    onCollisionEntered(collision) {
        console.log("Entrou em colosão");
    }

    /**
     * Esse método é chamado quando um objeto para de colidir com este
     * @param {Collider} other 
     */
    onCollisionExit(other) {
        console.log("Parou de colidir");
    }

    update() {
        if (this.vida <=0){
            let fala = "Tanque " + this.color + " perdeu!";
            GameOver(fala);
        }
        
    }

}

export default Tank;