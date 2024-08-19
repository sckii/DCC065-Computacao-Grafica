import { CSS2DObject } from '../../build/jsm/Addons.js';
import { Object3D } from '../../build/three.module.js';

class HealthBar extends CSS2DObject {
    constructor(max) {
        const progressBarElement = document.createElement( 'progress' );
        progressBarElement.className = 'healthBar';
        progressBarElement.max = max;
        progressBarElement.value = max;
        
        super(progressBarElement);

        this.position.set( -.2, 2, 0 );
        this.layers.set( 0 );
    }

    setAmount(amount) {
        this.element.value = amount;
    }
}

export default HealthBar