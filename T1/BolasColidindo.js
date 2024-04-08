import * as THREE from  'three';
import { OrbitControls } from '../build/jsm/controls/OrbitControls.js';
import {initRenderer, 
        initCamera,
        initDefaultBasicLight,
        setDefaultMaterial,
        InfoBox,
        onWindowResize,
        createGroundPlaneXZ} from "../libs/util/util.js";
import Ball from './Modelos/Ball.js';

let scene, renderer, camera, material, light, orbit; // Initial variables
scene = new THREE.Scene();    // Create main scene
renderer = initRenderer();    // Init a basic renderer
camera = initCamera(new THREE.Vector3(0, 15, 30)); // Init camera in this position
material = setDefaultMaterial(); // create a basic material
light = initDefaultBasicLight(scene); // Create a basic light to illuminate the scene
orbit = new OrbitControls( camera, renderer.domElement ); // Enable mouse rotation, pan, zoom etc.

// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

// Show axes (parameter is size of each axis)
let axesHelper = new THREE.AxesHelper( 12 );
scene.add( axesHelper );

// create the ground plane
let plane = createGroundPlaneXZ(20, 20)
scene.add(plane);


const balls = new Array();

for (let i = 0; i < 20; i++) {
	let ball = new Ball(((i%6) * 3) -8, 2, Math.floor(i/6) * 3 - 8);
	scene.add(ball.mesh);
	balls.push(ball);
}

// Use this to show information onscreen
let controls = new InfoBox();
	controls.add("Basic Scene");
	controls.addParagraph();
	controls.add("Use mouse to interact:");
	controls.add("* Left button to rotate");
	controls.add("* Right button to translate (pan)");
	controls.add("* Scroll to zoom in/out.");
	controls.show();

render();
function render()
{
	balls.forEach(ball => {
		ball.update();
		

		/* balls.forEach(otherBall => {
			if (ball !== otherBall) {
				ball.colliderComponent.checkCollisionWith(otherBall.colliderComponent);
			}
		}); */
	});

	physics();
	requestAnimationFrame(render);
	renderer.render(scene, camera) // Render scene
}

function physics() {
	for (let i = 0; i < balls.length; i++) {
		for (let j = i+1; j < balls.length; j++) {
			balls[i].colliderComponent.getClosestPointTo(balls[j].mesh.position)
		}		
	}
}