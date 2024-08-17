import * as THREE from  'three';
import SphereCollider from '../Physics/SphereCollider.js';
import Collision from '../Physics/Collision.js';
import { removeFromScene } from '../Functions/RemoveFromScene.js';
import Cannon from './Cannon.js';
import Tank from './Tank.js';


class Bullet {
    constructor(position, dir, shooter) {

        this.shooter = shooter;   // O que atirou

        // Visual
        this.radius = 0.25;
        this.geometry = this.buildMesh(position.x, position.z);
        this.position = this.geometry.position;

        // Movimento
        this.dir = dir;    
        this.dir.setY(0);
        this.dir.normalize();
        this.speed = 0.3;

        // Colisão
        this.colliderComponent = new SphereCollider(this, this.radius);
        this.numColision = 0;
    }

    buildMesh(x, z) {
        const geometry = new THREE.SphereGeometry(this.radius,15,15);
        const material = this.setMaterial();
        const bullet = new THREE.Mesh(geometry, material);
        bullet.position.set(x, 1, z);

        return bullet;
    }

    setMaterial(){
        let material;
        if(this.shooter instanceof Cannon){
            material = new THREE.MeshLambertMaterial({
                color:"rgb(46,46,46)"
            });
        }
        if(this.shooter instanceof Tank){
            if(this.shooter.color == "Red"){
                material = new THREE.MeshLambertMaterial({
                    color: "rgb(220,60,60)"
                });
            }
            else if(this.shooter.color == "Blue"){
                material = new THREE.MeshLambertMaterial({
                    color: "rgb(60,60,220)"
                });
            }
            else {
                material = new THREE.MeshLambertMaterial({
                    color: "rgb(60,220,60)"
                });
            }
        }
        return material;
    }
    
    /**
     * Esse método é chamado quando esse objeto entra em colisão com outro.
     * @param {Collision} collision 
     */
    onCollisionEntered(collision) {
        // Faz com que o tiro não bata em outros e no próprio tanque
        if(collision.other === this.shooter || collision.other instanceof Bullet){     
            return;
        }
        
        if(collision.other instanceof Cannon){     
            removeFromScene(this);
            return;
        }
        
        this.position.add(collision.getNormal().multiplyScalar(.1));
        
        this.numColision = this.numColision + 1;
        if (collision.other instanceof Tank){
            collision.other.reciveDamage(1);
            removeFromScene(this);
            return;
        }
        this.dir.reflect(collision.getNormal());
        this.dir.normalize();
    }

    /**
     * Esse método é chamado quando um objeto para de colidir com este
     * @param {Collider} other 
     */
    onCollisionExit(other) {
        
    }

    update() {
        this.geometry.translateOnAxis(this.dir, this.speed);
    
        //console.log(this.numColision);
        if (this.numColision >= 3 ){
            removeFromScene(this);
        }
        
        //this.colliderComponent.checkBoundCollision();
    }
}

export default Bullet;