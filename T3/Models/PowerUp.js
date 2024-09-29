import * as THREE from  'three';
import AABBCollider from "../Physics/AABBCollider.js";
import Bullet from './Bullet.js';
import Tank from './Tank.js';
import { removeFromScene } from '../Functions/SceneGlobals.js';

class PowerUp{ 
    constructor(currentLevel, scene){
        this.level = currentLevel;
        this.player = scene.playerTank;
        this.position = this.getPosition(currentLevel);
        this.type = this.getType();
        this.geometry = this.buildMesh(this.position.x, this.position.z);
        this.isActive = false;
        // Colisão
        this.colliderComponent = new AABBCollider(this, 1,1);

        scene.activePowerUp = this;

        this.startSpawn(scene);
        
    }
    startSpawn(scene){
        // Função que será chamada a cada 10 segundos
        if(!this.isActive){
            this.isActive = true
            this.spawInterval = setInterval(() => {
                this.spawn(scene);
            }, 10000);
        }
    }
    spawn(scene){
        this.position = this.getPosition(this.level);
        this.type = this.getType();
        this.geometry = this.buildMesh(this.position.x, this.position.z);
        this.isActive = true;
        scene.add(this.geometry);
        scene.physics.add(this.colliderComponent); 
        scene.updateList.push(this);
    }

    buildMesh(x, z){
        if(this.type == 1){         //healing
            const geometry = new THREE.CapsuleGeometry( 0.5, 1, 4, 8 ); 
            const material = new THREE.MeshPhongMaterial({
                color: "rgb(60,220,60)",
                shininess: "200",
                specular: "rgb(255,255,255)"});
            const capsule = new THREE.Mesh( geometry, material );
            capsule.rotateZ(THREE.MathUtils.degToRad(45));
            capsule.position.set(x, 1, z);
            return capsule;
        }
        if(this.type == 2){         //tiro
            const geometry = new THREE.IcosahedronGeometry(1,0); 
            const material = new THREE.MeshPhongMaterial({
                color: "rgb(220,60,60)",
                shininess: "200",
                specular: "rgb(255,255,255)"});
            const icosahedron = new THREE.Mesh( geometry, material );
            icosahedron.position.set(x, 1, z);
            return icosahedron;
        }
    }

    getPosition(currentLevel){  
        if(currentLevel == 1){
            let coordinates = [
                { x: 5, z: 5 },
                { x: 5, z: 26 },
                { x: 16, z: 5 },
                { x: 16, z: 26 },
                { x: 11, z: 16 }
            ];
            let randomIndex = Math.floor(Math.random() * coordinates.length);
            return coordinates[randomIndex];
        }
        if(currentLevel == 2){
            let coordinates = [
                { x: 18, z: 17 },
                { x: 4, z: 17 },
                { x: 4, z: 4 },
            ];
            
            let randomIndex = Math.floor(Math.random() * coordinates.length);
            return coordinates[randomIndex];
        }
        if(currentLevel == 3){
            let coordinates = [
                { x: 22, z: 5 },
                { x: 4, z: 17 },
                { x: 4, z: 5 },
                { x: 22, z: 27 },
                { x: 4, z: 37 }
            ];
            
            let randomIndex = Math.floor(Math.random() * coordinates.length);
            return coordinates[randomIndex];
        }
    }

    getType(){
        let types = [
            1,          // healing
            2           // tiro
            ];
        
        let randomIndex = Math.floor(Math.random() * types.length);
        return types[randomIndex];
    }
    /**
     * Esse método é chamado quando esse objeto entra em colisão com outro.
     * @param {Collision} collision 
     */
    onCollisionEntered(collision) {
        if(collision.other instanceof Tank && collision.other == this.player){
            if(this.type == 1) {        // heal
                collision.other.lifePoints += 2;
            }
            if(this.type == 2) {        //tiro
                
            }
        }
        this.isActive = false
        removeFromScene(this);
    }
    /**
     * Chamado todos os frames para cada colisão com este objeto
     * @param {Collision} collision 
     */   
    onCollision(collision){
        
    }

    /**
     * Esse método é chamado quando um objeto para de colidir com este
     * @param {Collider} other 
     */
    onCollisionExit(other) {
        
    }

    update() {
        this.geometry.rotateX(THREE.MathUtils.degToRad(1));
        this.geometry.rotateY(THREE.MathUtils.degToRad(1));
        this.geometry.rotateZ(THREE.MathUtils.degToRad(1));
    }

}   export default PowerUp;