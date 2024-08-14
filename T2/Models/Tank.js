import * as THREE from  'three';
import AABBCollider from '../Physics/AABBCollider.js';
import GameOver from '../Functions/GameOver.js';
import Collision from '../Physics/Collision.js';
import Bullet from './Bullet.js';
import { GLTFLoader } from '../../build/jsm/loaders/GLTFLoader.js';
import { Vector3 } from '../../build/three.module.js';


class Tank {
    constructor(x, z, color) {

        this.geometry = this.buildGeometry(color); // nao da pra usar this.color pq ele nao ta no msm scopo
        this.geometry.position.set(x, 0, z);
        this.position = this.geometry.position;
        this.color = color;

        this.directionTank =  new THREE.Vector3(0, 0, 0);        
        
        // Adiciona colisão ao tanque   
        this.colliderComponent = new AABBCollider(this, 2.5, 2.5); 
        this.worldDir = new Vector3();

        this.lifePoints = 10;
        this.isDead = false;
    }

    buildGeometry(color){
        var loader = new GLTFLoader( );
        let mesh = new THREE.Object3D();
        loader.load( './Models/tank.glb', function ( gltf ) {
            let obj = gltf.scene;
            obj.traverse( (child) => {
                if(color == "Red"){
                    if(!(child.name == "Tank_Wheel_1" || child.name == "Tank_Wheel_2" || child.name == "Tank_Wheel_3" || child.name == "Tank_Wheel_4" || child.name == "Tank_Wheel_5")){
                    child.material = new THREE.MeshPhongMaterial({
                        color: "rgb(220,60,60)",
                        shininess: "200",
                        specular: "rgb(255,255,255)"
                        });
                    }
                }
                else if(color == "Blue"){
                    if(!(child.name == "Tank_Wheel_1" || child.name == "Tank_Wheel_2" || child.name == "Tank_Wheel_3" || child.name == "Tank_Wheel_4" || child.name == "Tank_Wheel_5")){
                        child.material = new THREE.MeshPhongMaterial({
                            color: "rgb(60,60,220)",
                            shininess: "200",
                            specular: "rgb(255,255,255)"
                        });
                    }
                }
                else {
                    if(!(child.name == "Tank_Wheel_1" || child.name == "Tank_Wheel_2" || child.name == "Tank_Wheel_3" || child.name == "Tank_Wheel_4" || child.name == "Tank_Wheel_5")){
                        child.material = new THREE.MeshPhongMaterial({
                            color: "rgb(60,220,60)",
                            shininess: "200",
                            specular: "rgb(255,255,255)"
                        });
                    }
                }
            });
            mesh.add(gltf.scene);
            mesh.castShadow = true;
        });
        if(color == "Red"){
            mesh.rotateY(THREE.MathUtils.degToRad(90))
        }
        else if(color == "Blue"){
            mesh.rotateY(THREE.MathUtils.degToRad(180))
        }
        else {
            mesh.rotateY(THREE.MathUtils.degToRad(-90))
        }
        let scale = 0.65
        mesh.scale.set(scale, scale, scale);
        return mesh;
    };

    shoot(scene, updateList, physics){
        var shootDirection = new Vector3;
        this.geometry.getWorldDirection(shootDirection);

        let shootPosition = new Vector3()
        shootPosition.copy(this.geometry.position);
        const shoot = new Bullet(shootPosition, shootDirection, this);

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
            this.geometry.position.add(collision.getNormal().multiplyScalar(.15));
    }

    update() {
        if (this.lifePoints <=0 && !this.isDead){
            this.isDead = true;
            GameOver();
        }

        //this.geometry.translateOnAxis(this.directionTank, 0.1);
        this.worldDir.multiplyScalar(0.1);
        this.geometry.position.add(this.worldDir);

    }

    setDir(directionTank) {
        this.worldDir = new Vector3(0,0,directionTank);
        this.worldDir.transformDirection(this.geometry.matrixWorld);
    }

}

export default Tank;