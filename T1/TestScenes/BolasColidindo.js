import * as THREE from  'three';
import { OrbitControls } from '../../build/jsm/controls/OrbitControls.js';
import Stats from '../../build/jsm/libs/stats.module.js'
import {initRenderer, 
        initCamera,
        initDefaultBasicLight,
        setDefaultMaterial,
        onWindowResize,
        createGroundPlaneXZ} from "../../libs/util/util.js";
import Ball from '../Modelos/Ball.js';
import PhysicsEnviroment from '../Physics/PhysicsEnvironment.js';
import { Vector3 } from '../../build/three.module.js';

let scene, renderer, camera, material, light, orbit; // Initial variables
scene = new THREE.Scene();    // Create main scene
setScene(scene);

renderer = initRenderer();    // Init a basic renderer
camera = initCamera(new THREE.Vector3(0, 15, 30)); // Init camera in this position
material = setDefaultMaterial(); // create a basic material
light = initDefaultBasicLight(scene); // Create a basic light to illuminate the scene
orbit = new OrbitControls( camera, renderer.domElement ); // Enable mouse rotation, pan, zoom etc.

// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

// Contador de FPS
var clock = new THREE.Clock();
var time = 0;
var stats = new Stats();
document.getElementById("webgl-output").appendChild(stats.domElement);

// Show axes (parameter is size of each axis)
let axesHelper = new THREE.AxesHelper( 12 );
scene.add( axesHelper );

// create the ground plane
let plane = createGroundPlaneXZ(20, 20)
scene.add(plane);

const physics = new PhysicsEnviroment()
const updateList = new Array();

for (let i = 0; i < 20; i++) {
	let ball = new Ball(((i%6) * 3) -8, 2, Math.floor(i/6) * 3 - 8, 1);
	//let ball = new Ball(i*6, 2, i*6, 1);
	scene.add(ball.mesh);
	physics.add(ball.colliderComponent);
	updateList.push(ball);
}

render();
function render()
{
	var dt = clock.getDelta();
	updateList.forEach(ball => {
		ball.update();
	});
	physics.update();

	time += dt;
	stats.update();
	requestAnimationFrame(render);
	renderer.render(scene, camera) // Render scene
}