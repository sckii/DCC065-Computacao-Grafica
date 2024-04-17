import * as THREE from  'three';
import {setDefaultMaterial} from "../../libs/util/util.js";
import Ball from './Ball.js';
import AABBCollider from '../Physics/AABBCollider.js';
import GameOver from '../Funcoes/GameOver.js';
import { Vector3 } from '../../build/three.module.js';
import Collision from '../Physics/Collision.js';


class Tank {
    constructor(x, y, z, colors ) {

        // Define a posição incial do tanque
        this.x = x;
        this.y = y;
        this.z = z;
        this.direcaoTanque =  new THREE.Vector3(0, 0, 0);

        // VisuaL
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.geometry = this.buildGeometry();
        this.position = this.geometry.position;
        
        // Adiciona colisão ao tanque   
        this.colliderComponent = new AABBCollider(this, 2.5, 2.5); 
        this.worldDir = new Vector3();

        this.vida = 10;
        this.morto = false;
    }

    buildGeometry(){

        //cria a box inicial
        const geometry = new THREE.BoxGeometry(2.5, 0.5, 1.7);
        const material = setDefaultMaterial(this.color);
        const caixa = new THREE.Mesh(geometry, material);
            caixa.position.set(this.x, this.y, this.z);

        //define as rodas
        const materialRoda = setDefaultMaterial("black");
        const geometryRoda = new THREE.CylinderGeometry(0.4, 0.4, 0.5, 32); 
        geometryRoda.rotateX(THREE.MathUtils.degToRad(90));

        for (let z = -0.65; z<=0.65; z = z + 1.3){      // cria as rodas
            for(let x = -0.75; x<=0.75; x = x + 0.75){      
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
        const tiro = new Ball(tiroPosition, 0.25, direcaoTiro, this);

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
     * Chamado todos os frames para cada colisão com este objeto
     * @param {Collision} collision 
     */   
    onCollision(collision){
        if (collision.other.isBlock || collision.other instanceof Tank)
            this.position.add(collision.getNormal().multiplyScalar(.15));
    }

    update() {
        if (this.vida <=0 && !this.morto){
            this.morto = true;
            GameOver(this.color);
        }

        //this.geometry.translateOnAxis(this.direcaoTanque, 0.1);
        this.worldDir.multiplyScalar(0.1);
        this.position.add(this.worldDir);

    }

    setDir(direcaoTanque) {
        this.worldDir = new Vector3(direcaoTanque,0,0);
        this.worldDir.transformDirection(this.geometry.matrixWorld);
    }

}

export default Tank;