import * as THREE from 'three';
import { Scene } from "../../build/three.module.js";
import MainCamera from "../Functions/MainCamera.js";
import { initCamera, initRenderer } from "../../libs/util/util.js";
import { OrbitControls } from '../../build/jsm/Addons.js';
import PhysicsEnvironment from '../Physics/PhysicsEnvironment.js';
import { onWindowResize } from '../../libs/util/util.js';

class GameScene extends Scene{
    constructor(renderer) {
        super();
        this.renderer = renderer;

        // Camera principal
        this.mainCamera = new MainCamera(0, 8, 0);
        this.add(this.mainCamera.cameraHolder)
        window.addEventListener('resize', () => { onWindowResize(this.mainCamera.update(), this.renderer) }, false);

        // Camera secundaria (orbital)
        this.orbitCamera = initCamera(new THREE.Vector3(-16, 20, 16)); // Init second camera nesssa posição
        let orbit = new OrbitControls(this.orbitCamera, this.renderer.domElement); // Habilitando mouse rotation, pan, zoom etc.
        this.orbitCamera.lookAt(11, 0, 16);
        orbit.target = new THREE.Vector3(11, 0, 16);
        window.addEventListener('resize', () => { onWindowResize(this.orbitCamera, this.renderer) }, false);

        this.physics = new PhysicsEnvironment();
        this.updateList = [];
        this.tankList = [];
        this.cameraList = [];
        this.mainCamera.setTracking(this.tankList);        
    }
}

export default GameScene;