function KeyboardMovement(obj) {
    if ( keyboard.pressed("up") ) {
        obj.z -= 0.1;
    }

    if ( keyboard.pressed("down") ) {
        obj.z += 0.1;
    }

    if ( keyboard.pressed("left") ) {
        obj.x -= 0.1;
    }

    if ( keyboard.pressed("right") ) {
        obj.x += 0.1;
    }
}

export default KeyboardMovement;