import * as THREE from  'three';
import AABBCollider from '../Physics/AABBCollider.js';
import GameOver from '../Functions/GameOver.js';
import Collision from '../Physics/Collision.js';
import Bullet from './Bullet.js';
import { GLTFLoader } from '../../build/jsm/loaders/GLTFLoader.js';


class NewTank {
    constructor(x, z) {

        // Define a posição incial do tanque
        this.position = new THREE.Vector3(x, 0, z);
        this.mesh = this.buildGeometry();
        
        //this.geometry = 
        // scene.add(this.model.traverse(function (child) {
        //     if (child.isMesh) {

        //         scene.add(child.geometry);
        //     }
        // }));


        this.directionTank =  new THREE.Vector3(0, 0, 0);
        
        
        // Adiciona colisão ao tanque   
        // this.colliderComponent = new AABBCollider(this, 2.5, 2.5); 
        // this.worldDir = new Vector3();

        this.lifePoints = 10;
        this.isDead = false;
    }

    buildGeometry(){
        var loader = new GLTFLoader( );
        let mesh = new THREE.Object3D()
        loader.load( './Models/tank.glb', function ( gltf ) {
            let obj = gltf.scene;
            obj.traverse( (child) => {
                child.material = new THREE.MeshPhongMaterial({
                    color: 'rgb(200,50,50)',
                    shininess: "200",
                    specular: "rgb(255,255,255)"
                });
            });
            mesh.add(gltf.scene);
            mesh.castShadow = true;
        });
        console.log(mesh);
        return mesh;
        };

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