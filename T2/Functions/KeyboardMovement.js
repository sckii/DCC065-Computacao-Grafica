import { Vector3 } from '../../build/three.module.js';
import KeyboardState from '../../libs/util/KeyboardState.js'
import * as THREE from  'three';


const keyboard = new KeyboardState();

function KeyboardMovement(tank, scene, updateList, physics) { 
    if ( keyboard.pressed("W") || keyboard.pressed("up") ) {
        console.log(tank)
        tank.setDir(1);
    }
    
    if ( keyboard.pressed("S") || keyboard.pressed("down") ) {
        tank.setDir(-1);
    }
    
    if ( keyboard.pressed("A") || keyboard.pressed("left")) {
        tank.geometry.rotateY(THREE.MathUtils.degToRad(5))
    }
    
    if ( keyboard.pressed("D") || keyboard.pressed("right") ) {
        tank.geometry.rotateY(THREE.MathUtils.degToRad(-5))
    }

    if (keyboard.down("space") || keyboard.down("Q")){
        tank.shoot(scene, updateList, physics);
    }            
}

export default KeyboardMovement;