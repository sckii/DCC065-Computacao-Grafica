import * as THREE from  'three';
import {setDefaultMaterial} from "../../libs/util/util.js";
import AABBCollider from '../Physics/AABBCollider.js';
import GameOver from '../Functions/GameOver.js';
import { Vector3 } from '../../build/three.module.js';
import Collision from '../Physics/Collision.js';
import Bullet from './Bullet.js';
import HealthBar from './HealthBar.js';


class Tank {
    constructor(x, y, z, colors ) {

        // Define a posição incial do tanque
        this.x = x;
        this.y = y;
        this.z = z;
        this.directionTank =  new THREE.Vector3(0, 0, 0);

        // VisuaL
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.geometry = this.buildGeometry();
        this.position = this.geometry.position;
        
        // Adiciona colisão ao tanque   
        this.colliderComponent = new AABBCollider(this, 2.5, 2.5); 
        this.worldDir = new Vector3();

        this.lifePoints = 10;
        this.isDead = false;

        this.healthBar = new HealthBar( this.lifePoints );
        this.geometry.add( this.healthBar );
    }

    buildGeometry(){

        //cria a box inicial
        const geometry = new THREE.BoxGeometry(2.5, 0.5, 1.7);
        const material = setDefaultMaterial(this.color);
        const box = new THREE.Mesh(geometry, material);
            box.position.set(this.x, this.y, this.z);

        //define as rodas
        const materialWhell = setDefaultMaterial("black");
        const geometryWhell = new THREE.CylinderGeometry(0.4, 0.4, 0.5, 32); 
        geometryWhell.rotateX(THREE.MathUtils.degToRad(90));

        for (let z = -0.65; z<=0.65; z = z + 1.3){      // cria as rodas
            for(let x = -0.75; x<=0.75; x = x + 0.75){      
                let whell = new THREE.Mesh(geometryWhell, materialWhell);
                whell.position.set(x, -0.3, z);
                box.add(whell);
            } 
        }
   
        //cria a parte de cima
        const geometryTop = new THREE.SphereGeometry(0.75, 32, 32);
        const top = new THREE.Mesh(geometryTop, material);
        top.castShadow = true;
        top.position.set(-0.4, 0.3, 0.0);
        box.add(top);

        //cria o cano
        const geometryBarrel = new THREE.CylinderGeometry(0.2, 0.2, 2.0, 32);
        const barrel = new THREE.Mesh(geometryBarrel, material);
        barrel.rotateZ(THREE.MathUtils.degToRad(90));
        barrel.position.set(1.0, 0.4, 0.0)
        top.add(barrel);

        return box;    
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
        //this.geometry.translateOnAxis(this.directionTank, 0.1);
        this.worldDir.multiplyScalar(0.1);
        this.position.add(this.worldDir);

    }

    reciveDamage(damage) {
        this.lifePoints -= damage;
        if (this.lifePoints <=0 && !this.isDead){
            this.isDead = true;
            GameOver(this.color);
        }
        this.healthBar.setAmount( this.lifePoints );
    }

    setDir(directionTank) {
        this.worldDir = new Vector3(directionTank,0,0);
        this.worldDir.transformDirection(this.geometry.matrixWorld);
    }

}

export default Tank;