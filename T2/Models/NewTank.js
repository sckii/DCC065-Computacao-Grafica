import * as THREE from  'three';
import {setDefaultMaterial} from "../../libs/util/util.js";
import AABBCollider from '../Physics/AABBCollider.js';
import GameOver from '../Functions/GameOver.js';
import { Vector3 } from '../../build/three.module.js';
import Collision from '../Physics/Collision.js';
import Bullet from './Bullet.js';
import { GLTFLoader } from '../../build/jsm/loaders/GLTFLoader.js';


class NewTank {
    constructor(x, y, z, scene) {

        // Define a posição incial do tanque
        this.x = x;
        this.y = y;
        this.z = z;
        this.directionTank =  new THREE.Vector3(0, 0, 0);

        this.geometry = this.buildGeometry(scene);
        // Visual
        
        
        // Adiciona colisão ao tanque   
        // this.colliderComponent = new AABBCollider(this, 2.5, 2.5); 
        // this.worldDir = new Vector3();

        this.lifePoints = 10;
        this.isDead = false;
    }

    buildGeometry(scene){
        var loader = new GLTFLoader( );
        loader.load( './Models/tank.glb', function ( gltf ) {
            var playerTank = gltf.scene;
            playerTank.traverse( function ( child ) {
            if( child.isMesh ) child.castShadow = true;
        });
        
        console.log(playerTank);

        playerTank.position.set(4.0,  0.0,  4.0);
        playerTank.rotateY(THREE.MathUtils.degToRad(90));
        scene.add ( playerTank );
        });
           
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
        if (this.lifePoints <=0 && !this.isDead){
            this.isDead = true;
            GameOver();
        }

        //this.geometry.translateOnAxis(this.directionTank, 0.1);
        this.worldDir.multiplyScalar(0.1);
        this.position.add(this.worldDir);

    }

    setDir(directionTank) {
        this.worldDir = new Vector3(directionTank,0,0);
        this.worldDir.transformDirection(this.geometry.matrixWorld);
    }

}

export default NewTank;