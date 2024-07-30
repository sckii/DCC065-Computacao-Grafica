import { Vector3 } from '../../build/three.module.js';
import KeyboardState from '../../libs/util/KeyboardState.js'
import * as THREE from  'three';


const keyboard = new KeyboardState();

function KeyboardMovement(tank, player = "P1", scene, updateList, physics) {
    
    if (player === "P1") {
        if ( keyboard.pressed("W") ) {
            tank.setDir(1);
        }
        
        if ( keyboard.pressed("S") ) {
            tank.setDir(-1);
        }
        
        if ( keyboard.pressed("A") ) {
            tank.geometry.rotateY(THREE.MathUtils.degToRad(5))
        }
        
        if ( keyboard.pressed("D") ) {
            tank.geometry.rotateY(THREE.MathUtils.degToRad(-5))
            //tank.geometry.translateZ(.1);
        }

        if (keyboard.down("space") || keyboard.down("Q")){
            tank.shoot(scene, updateList, physics);
        }        
    }

    if (player === "P2") {
        if ( keyboard.pressed("up") ) {
            //tank.geometry.translateX(0.1);
            tank.setDir(1);
        }
    
        if ( keyboard.pressed("down") ) {
            //tank.geometry.translateX(-0.1);
            tank.setDir(-1);
        }
    
        if ( keyboard.pressed("left") ) {
            tank.geometry.rotateY(THREE.MathUtils.degToRad(5))
        }

        if ( keyboard.pressed("right") ) {
            tank.geometry.rotateY(THREE.MathUtils.degToRad(-5))
        }
        if ((keyboard.down("/")) || keyboard.down(",")){ 
            tank.shoot(scene, updateList, physics);
        }
    }
}

export default KeyboardMovement;