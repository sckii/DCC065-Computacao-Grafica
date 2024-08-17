import { CSS2DObject } from '../../build/jsm/Addons.js';
import { Object3D } from '../../build/three.module.js';

class HealthBar extends CSS2DObject {
    constructor(max) {
        const progressBarElement = document.createElement( 'progress' );
        progressBarElement.className = 'healthBar';

        
        progressBarElement.max = max;
        super(progressBarElement);
        this.progressBarElement = progressBarElement;

        this.position.set( -.2, 2, 0 );
        this.layers.set( 0 );

        /* const style = document.createElement('style');
        style.innerHTML = `
            progress::-webkit-progress-value {
                background-color: green;
            }
            progress::-moz-progress-bar {
                background-color: green;
            }
        `;
        
        // Add the style to the document head
        document.head.appendChild(style); */
    }

    setAmount(amount) {
        this.progressBarElement.value = amount
    }
}

export default HealthBar