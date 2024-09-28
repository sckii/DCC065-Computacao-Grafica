import * as THREE from  'three';
import AABBCollider from '../Physics/AABBCollider.js';
import Collision from '../Physics/Collision.js';
import Bullet from './Bullet.js';
import HealthBar from './HealthBar.js';
import { GLTFLoader } from '../../build/jsm/loaders/GLTFLoader.js';
import { Vector3 } from '../../build/three.module.js';
import { getSounds, getCurrentScene, removeFromScene } from '../Functions/SceneGlobals.js';

class Tank {
    constructor(x, z, color, rotate) {

        this.color = color;
        this.material = this.setMaterial(this.color);
        const { mesh, newObject } = this.buildGeometry(this.material, rotate);
        this.mesh = newObject
        this.geometry = mesh;
        this.geometry.position.set(x, 0, z);
        this.position = this.geometry.position;

        this.directionTank =  new THREE.Vector3(0, 0, 0);        
        
        // Adiciona colisão ao tanque   
        this.colliderComponent = new AABBCollider(this, 2.5, 2.5); 
        this.worldDir = new Vector3();

        this.lifePoints = 10;
        this.tempLifePoints = 0;
        this.isDead = false;
        this.godMod = false

        this.healthBar = new HealthBar( this.lifePoints );
        this.geometry.add( this.healthBar );
    }

    buildGeometry(material, rotate){
        var loader = new GLTFLoader( );
        let mesh = new THREE.Object3D();
        const geometry = new THREE.BoxGeometry(3, 3, 3); // Criar uma esfera
        const material2 = new THREE.MeshBasicMaterial({ color: 0x00ff00, opacity: 0.0, transparent: true }); // Material verde
        const newObject = new THREE.Mesh(geometry, material2);

        loader.load( './Assets/Objects/tank.glb', function ( gltf ) {
            let obj = gltf.scene;
            obj.traverse( (child) => {
                if(!(child.name == "Tank_Wheel_1" || child.name == "Tank_Wheel_2" || child.name == "Tank_Wheel_3" || child.name == "Tank_Wheel_4" || child.name == "Tank_Wheel_5")){
                    child.material = material
                    child.castShadow = true;
                    child.reciveShadow = true; 
                }
            });

            // Posicionar o novo objeto
            newObject.position.set(0, 0, 0);

            // Adicionar o novo objeto ao modelo
            obj.add(newObject);

            mesh.rotateY(rotate*THREE.MathUtils.degToRad(90));
            mesh.add(gltf.scene);
        });

        let scale = 0.65
        mesh.scale.set(scale, scale, scale);
        this.mesh = newObject;
        return {mesh, newObject};
    };

    setMaterial(color){
        let material;
        if(color == "Red"){
            material = new THREE.MeshPhongMaterial({
                color: "rgb(220,60,60)",
                shininess: "200",
                specular: "rgb(255,255,255)"
            });
        }
        else if(color == "Blue"){
            material = new THREE.MeshPhongMaterial({
                    color: "rgb(60,60,220)",
                    shininess: "200",
                    specular: "rgb(255,255,255)"
            });
        }
        else if(color == "DarkRed"){
            material = new THREE.MeshPhongMaterial({
                    color: "rgb(139,0,0)",
                    shininess: "200",
                    specular: "rgb(255,255,255)"
            });
        }
        else if(color == "LightBlue"){
            material = new THREE.MeshPhongMaterial({
                    color: "rgb(133,168,255)",
                    shininess: "200",
                    specular: "rgb(255,255,255)"
            });
        }
        else {
            material = new THREE.MeshPhongMaterial({
                    color: "rgb(60,220,60)",
                    shininess: "200",
                    specular: "rgb(255,255,255)"
            });
        }
        return material;
    }

    shoot(scene){
        var shootDirection = new Vector3;
        this.geometry.getWorldDirection(shootDirection);

        let shootPosition = new Vector3()
        shootPosition.copy(this.geometry.position).add( new Vector3( 0,1.3,0));
        const shoot = new Bullet(shootPosition, shootDirection, this);

        scene.add(shoot.geometry);
        scene.physics.add(shoot.colliderComponent);
        scene.updateList.push(shoot); 

        const {shootSound}  = getSounds();
        shootSound.hit();
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
        if (!(collision.other instanceof Bullet)) {
            this.position.add(collision.getNormal().multiplyScalar(.15));
            this.normal = collision.getNormal();
        }
    }

    update() {
        //this.geometry.translateOnAxis(this.directionTank, 0.1);
        this.worldDir.multiplyScalar(0.1);
        this.geometry.position.add(this.worldDir);

    }

    reciveDamage(damage) {
        if(this.godMod){
            return;
        }
        this.lifePoints -= damage;
        if (this.lifePoints <=0 && !this.isDead){
            this.onDeath();
        }
        this.healthBar.setAmount( this.lifePoints );
        
        const {enemy, player}  = getSounds();

        const scene = getCurrentScene();

        if (this.mesh.id == scene.playerTank.mesh.id){
            player.hit();
        }
        else {
            enemy.hit();    
        }
    }

    /**
     * É chamado quando o tanque morre
     */
    onDeath() {
        this.isDead = true;
        this.healthBar.element.remove();
        removeFromScene(this);
        let scene = getCurrentScene();
        scene.bots = scene.bots.filter( bot => bot !== this);
        scene.tankList = scene.tankList.filter( bot => bot !== this);
    }

    setDir(directionTank) {
        this.worldDir = new Vector3(0,0,directionTank);
        this.worldDir.transformDirection(this.geometry.matrixWorld);
    }

    fatMod(isOn){
        if(isOn){
            this.geometry.scale.set(1.5, 1, 1);  
         }
         else{
            this.geometry.scale.set(0.65, 0.65, 0.65);  
         }
    }

}

export default Tank;