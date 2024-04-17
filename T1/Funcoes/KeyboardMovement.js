import { Vector3 } from '../../build/three.module.js';
import KeyboardState from '../../libs/util/KeyboardState.js'
import * as THREE from  'three';


const keyboard = new KeyboardState();

function KeyboardMovement(tanque, player = "P1", scene, updateList, physics) {
    
    if (player === "P1") {
        if ( keyboard.pressed("W") ) {
            tanque.setDir(1);
        }
        
        if ( keyboard.pressed("S") ) {
            tanque.setDir(-1);
        }
        
        if ( keyboard.pressed("A") ) {
            tanque.geometry.rotateY(THREE.MathUtils.degToRad(5))
        }
        
        if ( keyboard.pressed("D") ) {
            tanque.geometry.rotateY(THREE.MathUtils.degToRad(-5))
            //tanque.geometry.translateZ(.1);
        }

        if (keyboard.down("space") || keyboard.down("Q")){
            tanque.shoot(scene, updateList, physics);
        }        
    }

    if (player === "P2") {
        if ( keyboard.pressed("up") ) {
            //tanque.geometry.translateX(0.1);
            tanque.setDir(1);
        }
    
        if ( keyboard.pressed("down") ) {
            //tanque.geometry.translateX(-0.1);
            tanque.setDir(-1);
        }
    
        if ( keyboard.pressed("left") ) {
            tanque.geometry.rotateY(THREE.MathUtils.degToRad(5))
        }

        if ( keyboard.pressed("right") ) {
            tanque.geometry.rotateY(THREE.MathUtils.degToRad(-5))
        }
        if ((keyboard.down("/")) || keyboard.down(",")){ 
            tanque.shoot(scene, updateList, physics);
        }
    }
}

export default KeyboardMovement;