import KeyboardState from '../../libs/util/KeyboardState.js'
import * as THREE from  'three';

const keyboard = new KeyboardState();
keyboard.update();

function KeyboardMovement(obj, player = "P1") {
    if (player === "P1") {
        if ( keyboard.pressed("up") ) {
            obj.translateX(0.1);
        }
    
        if ( keyboard.pressed("down") ) {
            obj.translateX(-0.1);
        }
    
        if ( keyboard.pressed("left") ) {
            obj.rotateY(THREE.MathUtils.degToRad(5))
        }
    
        if ( keyboard.pressed("right") ) {
            obj.rotateY(THREE.MathUtils.degToRad(-5))
        }
    }

    if (player === "P2") {
        if ( keyboard.pressed("W") ) {
            obj.translateX(0.1);
        }
    
        if ( keyboard.pressed("S") ) {
            obj.translateX(-0.1);
        }
    
        if ( keyboard.pressed("A") ) {
            obj.rotateY(THREE.MathUtils.degToRad(5))
        }
    
        if ( keyboard.pressed("D") ) {
            obj.rotateY(THREE.MathUtils.degToRad(-5))
        }
    }
}

export default KeyboardMovement;