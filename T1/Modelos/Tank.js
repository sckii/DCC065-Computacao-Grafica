import * as THREE from  'three';
import {setDefaultMaterial} from "../../libs/util/util.js";
import Ball from './Ball.js';
import AABBCollider from '../Physics/AABBCollider.js';
import GameOver from '../Funcoes/GameOver.js';
import { Vector3 } from '../../build/three.module.js';
import Collision from '../Physics/Collision.js';


class Tank {
    constructor(x, y, z, color ) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.color = color;

        this.geometry = this.buildGeometry();
        this.position = this.geometry.position;

        this.direcaoTanque =  new THREE.Vector3(0, 0, 0);

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
        var direcaoTiro = new Vector3;
        this.geometry.getWorldDirection(direcaoTiro);
        direcaoTiro.applyAxisAngle(new Vector3(0,1,0), THREE.MathUtils.degToRad(90));

        let tiroPosition = new Vector3()
        tiroPosition.copy(this.position);
        tiroPosition.x += 3;
        const tiro = new Ball(tiroPosition, 0.25, direcaoTiro);

        scene.add(tiro.mesh);
        physics.add(tiro.colliderComponent);
        updateList.push(tiro); 
    }

    /**
     * Esse método é chamado quando esse objeto entra em colisão com outro.
     * @param {Collision} collision 
     */
    onCollisionEntered(collision) {

    }

    /**
     * Esse método é chamado quando um objeto para de colidir com este
     * @param {Collider} other 
     */
    onCollisionExit(other) {
        
    }

    /**
     * @param {Collision} collision 
     */
    onCollision(collision){
        let localNormal = new Vector3().copy(collision.getNormal())
        //this.geometry.localToWorld(localNormal);
        localNormal.transformDirection(this.geometry.matrix);
        localNormal.z = -localNormal.z
        console.log(`
            normal: ${collision.getNormal().x}, ${collision.getNormal().y}, ${collision.getNormal().z}
            local: ${localNormal.x}, ${localNormal.y}, ${localNormal.z}
            dir: ${this.direcaoTanque.x}, ${this.direcaoTanque.y}, ${this.direcaoTanque.z}
            dot: ${localNormal.dot(this.direcaoTanque)}
        `);

        if (localNormal.dot(this.direcaoTanque) < 0) {
            this.direcaoTanque = this.direcaoTanque.projectOnPlane(localNormal);        
        }
    }
    /* onCollision(collision){
        let worldDir = new Vector3().copy(this.direcaoTanque);
        worldDir.transformDirection(this.geometry.matrixWorld);
    } */

    update() {
        if (this.vida <=0){
            let fala = "Tanque " + this.color + " perdeu!";
            GameOver(fala);
        }

        this.geometry.translateOnAxis(this.direcaoTanque, 0.1);

    }

}

export default Tank;