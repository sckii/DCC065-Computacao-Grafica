import KeyboardState from '../../libs/util/KeyboardState.js'
import * as THREE from  'three';
import Tank from '../Modelos/Tank.js';
import Ball from '../Modelos/Ball.js';


const keyboard = new KeyboardState();

function KeyboardMovement(tanque, player = "P1", scene) {
    
    if (player === "P1") {
        if ( keyboard.pressed("W") ) {
            tanque.geometry.translateX(0.1);
        }
    
        if ( keyboard.pressed("S") ) {
            tanque.geometry.translateX(-0.1);
        }
    
        if ( keyboard.pressed("A") ) {
            tanque.geometry.rotateY(THREE.MathUtils.degToRad(5))
        }
    
        if ( keyboard.pressed("D") ) {
            tanque.geometry.rotateY(THREE.MathUtils.degToRad(-5))
        }

        if (keyboard.down("space") || keyboard.down("Q")){
            tanque.shoot(scene);
        }
    }

    if (player === "P2") {
        if ( keyboard.pressed("up") ) {
            tanque.geometry.translateX(0.1);
        }
    
        if ( keyboard.pressed("down") ) {
            tanque.geometry.translateX(-0.1);
        }
    
        if ( keyboard.pressed("left") ) {
            tanque.geometry.rotateY(THREE.MathUtils.degToRad(5))
        }

        if ( keyboard.pressed("right") ) {
            tanque.geometry.rotateY(THREE.MathUtils.degToRad(-5))
        }
        if ((keyboard.down("/")) || keyboard.down(",")){    //não consegui o /
            tanque.shoot(scene);
        }
    }
}

export default KeyboardMovement;