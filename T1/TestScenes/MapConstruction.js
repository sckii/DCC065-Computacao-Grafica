import * as THREE from  'three';
import KeyboardState from '../../libs/util/KeyboardState.js'
import { OrbitControls } from '../../build/jsm/controls/OrbitControls.js';
import Stats from '../../build/jsm/libs/stats.module.js'
import {initRenderer, 
        initCamera,
        initDefaultBasicLight,
        setDefaultMaterial,
        onWindowResize} from '../../libs/util/util.js';
import { buildMap } from '../Funcoes/Map.js'
import Ball from '../Modelos/Ball.js';
import PhysicsEnvironment from '../Physics/PhysicsEnvironment.js';
import { setScene } from '../Funcoes/removerDaScene.js';

let scene, renderer, camera, material, light, orbit; // Initial variables
scene = new THREE.Scene();    // Create main scene
setScene(scene);
renderer = initRenderer();    // Init a basic renderer
camera = initCamera(new THREE.Vector3(0, 15, 30)); // Init camera in this position
material = setDefaultMaterial(); // create a basic material
light = initDefaultBasicLight(scene); // Create a basic light to illuminate the scene
orbit = new OrbitControls( camera, renderer.domElement ); // Enable mouse rotation, pan, zoom etc.
let keyboard = new KeyboardState();


// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

// Show axes (parameter is size of each axis)
let axesHelper = new THREE.AxesHelper( 12 );
scene.add( axesHelper );

// Contador de FPS
var clock = new THREE.Clock();
var time = 0;
var stats = new Stats();
document.getElementById("webgl-output").appendChild(stats.domElement);

const matrix = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
]


let physics = new PhysicsEnvironment();
let updateList = [];
let blocks = buildMap(scene, matrix);
physics.addToMap(blocks);

for (let i = 0; i < 20; i++) {
    let pos = new THREE.Vector3(((i%6) * 3) +2, 1, Math.floor(i/6) * 3 +2)
    let dir = new THREE.Vector3(Math.random(), Math.random(), Math.random())
    let ball = new Ball(pos, .5, dir);
    scene.add(ball.mesh);
    physics.add(ball.colliderComponent);
    updateList.push(ball);
}


// ================

let n = new THREE.Vector3(1,0,1).normalize();
let d = new THREE.Vector3(-1,0,1);

console.log(`(${n.x}, ${n.z})`);
d.reflect(n);
console.log(`(${n.x}, ${n.z})`);


// ================


/* let tank = new Tank(0,1.2,0);
scene.add(tank.geometry); */

//var infoBox = new SecondaryBox("");

render();
function render()
{
	var dt = clock.getDelta();

	keyboard.update();

    updateList.forEach(element => {
        element.update();
    });

    time += dt;
	stats.update();

    physics.update();

	//KeyboardMovement(tank.geometry, "P2");
	//let p = worldToMatrix(tank.geometry.position);
	//infoBox.changeMessage(p.x + ", " + p.y);

	requestAnimationFrame(render);
	renderer.render(scene, camera) // Render scene
}