import * as THREE from 'three';
import { GLTFLoader } from '../../build/jsm/loaders/GLTFLoader.js';
import Tank from '../Models/Tank.js';
import Cannon from '../Models/Cannon.js';
import { createGroundPlane } from '../../libs/util/util.js';
import MainCamera from './MainCamera.js';
import { setScene } from './RemoveFromScene.js';
import { OrbitControls } from '../../build/jsm/controls/OrbitControls.js';
import {
   initRenderer,
   initCamera,
   onWindowResize, } from "../../libs/util/util.js";
import { Vector2, Vector3 } from '../../build/three.module.js';
import AABBCollider from '../Physics/AABBCollider.js';

const blockSize = 2;

export function buildLevel(nLvl, scene, updateList, physics, tankList){
    if(nLvl==1){
        level1(scene, updateList, physics, tankList);
    }
    if(nLvl==2){
        level2(scene, updateList, physics, tankList);
    }
}

function level1(scene, updateList, physics, tankList){

    // Constoi o mapa e sua fisica
    let matrixLvl1 = [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ]
    let blocks = buildMap(scene, matrixLvl1);
    physics.addToMap(blocks);

    // Iluminacao
    let ambientColor = "rgb(50,50,50)"
    let ambientLight = new THREE.AmbientLight(ambientColor);

    let dirColor = "rgb(255,255,255)";
    let dirLight = new THREE.DirectionalLight(dirColor, 0.2)

    scene.add(dirLight);
    scene.add(ambientLight);

    // Adiciona os tanques
    let redTank = new Tank(5, 5, "Red", 1);
    scene.add(redTank.geometry);
    physics.add(redTank.colliderComponent); 
    updateList.push(redTank);
    tankList.push(redTank);
    //KeyboardMovement(redTank, scene, scene.updateList, scene.physics);

    let blueTank = new Tank(5, 27, "Blue", 1);
    scene.add(blueTank.geometry);
    physics.add(blueTank.colliderComponent); 
    updateList.push(blueTank);
    tankList.push(blueTank);
}

function level2(scene, updateList, physics, tankList){

    // Fazer camera
    
    // Constoi o mapa e sua fisica
    let matrixLvl2 = [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ]
    let blocks = buildMap(scene, matrixLvl2);
    physics.addToMap(blocks);

    // Iluminacao
    // Luz ambiente
    let ambientColor = "rgb(30,30,30)";
    let ambientLight = new THREE.AmbientLight(ambientColor);
    scene.add(ambientLight);

    // Luz direcional
    let dirColor = "rgb(60,60,60)";
    let dirLight = new THREE.DirectionalLight(dirColor, 0.2);
    scene.add(dirLight);

    // Luz spot
    // Importa,define a posição e adiciona a cena os postes
    let spotLightMesh = getSpotLightMesh();
    let spotLightMesh2 = getSpotLightMesh();
    let spotLightMesh3 = getSpotLightMesh();
    let spotLightMesh4 = getSpotLightMesh();

    spotLightMesh.position.set(21, 2, 0.7);
    spotLightMesh2.position.set(0.7, 2, 17);
    spotLightMesh3.position.set(21.3, 2, 17);
    spotLightMesh4.position.set(0.7, 2, 33.3);

    spotLightMesh.rotateY(THREE.MathUtils.degToRad(-135));
    spotLightMesh3.rotateY(THREE.MathUtils.degToRad(180));
    spotLightMesh4.rotateY(THREE.MathUtils.degToRad(45));

    scene.add(spotLightMesh)
    scene.add(spotLightMesh2)
    scene.add(spotLightMesh3)
    scene.add(spotLightMesh4)

    // Cria as spotlights, configura e adiciona a cena
    let spotLight = new THREE.SpotLight("rgb(255,255,255)");
    spotLight.position.set(20, 7.8, 2);
    spotLight.angle = THREE.MathUtils.degToRad(30);
    spotLight.target.position.set(16,0,6);
    spotLight.castShadow = true;
    spotLight.distance = 15;
    spotLight.penumbra = 0.8;
    spotLight.intensity = 150;
    spotLight.shadow.camera.near = 3;    
    spotLight.shadow.camera.far = 15.0; 
    scene.add(spotLight);
    const spotHelper = new THREE.SpotLightHelper(spotLight, 0xFF8C00); //não sei o motivo mas só funciona se tiver essa linha

    let spotLight2 = new THREE.SpotLight();
    spotLight2.position.set(1.7, 7.8,17);
    spotLight2.angle = THREE.MathUtils.degToRad(30);
    spotLight2.target.position.set(4,0,17);
    spotLight2.castShadow = true;
    spotLight2.distance = 15;
    spotLight2.penumbra = 0.8;
    spotLight2.intensity = 150;
    spotLight2.shadow.camera.near = 3;    
    spotLight2.shadow.camera.far = 10.0; 
    scene.add(spotLight2);
    const spotHelper2 = new THREE.SpotLightHelper(spotLight2, 0xFF8C00);

    let spotLight3 = new THREE.SpotLight();
    spotLight3.position.set(20, 7.8, 17);
    spotLight3.angle = THREE.MathUtils.degToRad(30);
    spotLight3.target.position.set(18,0,17);
    spotLight3.castShadow = true;
    spotLight3.distance = 15;
    spotLight3.penumbra = 0.8;
    spotLight3.intensity = 150;
    spotLight3.shadow.camera.near = 3;    
    spotLight3.shadow.camera.far = 10.0; 
    scene.add(spotLight3);
    const spotHelper3 = new THREE.SpotLightHelper(spotLight3, 0xFF8C00);

    let spotLight4 = new THREE.SpotLight("rgb(255,255,255)");
    spotLight4.position.set(1.7, 7.8, 32);
    spotLight4.angle = THREE.MathUtils.degToRad(30);
    spotLight4.target.position.set(6,0,28);
    spotLight4.castShadow = true;
    spotLight4.distance = 15;
    spotLight4.penumbra = 0.8;
    spotLight4.intensity = 150;
    spotLight4.shadow.camera.near = 3;    
    spotLight4.shadow.camera.far = 15.0; 
    scene.add(spotLight4);
    const spotHelper4 = new THREE.SpotLightHelper(spotLight4, 0xFF8C00);
        
    // Adiciona os tanques
    let greenTank = new Tank(18, 4, "", 3);
    scene.add(greenTank.geometry);
    physics.add(greenTank.colliderComponent); 
    updateList.push(greenTank);
    tankList.push(greenTank)
    
    let redTank = new Tank(4, 30, "Red", 1);
    scene.add(redTank.geometry);
    physics.add(redTank.colliderComponent); 
    updateList.push(redTank);
    tankList.push(redTank)

    let blueTank = new Tank(18, 30, "Blue", 2.5);
    scene.add(blueTank.geometry);
    physics.add(blueTank.colliderComponent); 
    updateList.push(blueTank);
    tankList.push(blueTank)

    // Adiciona o canhao
    let cannon = new Cannon(11, 17, tankList, scene, scene.updateList, scene.physics);
    scene.add(cannon.geometry);
    scene.physics.add(cannon.colliderComponent); 
    scene.updateList.push(cannon);
}

function buildMap(scene, matrix) {
    let plane = createGroundPlane(matrix[0].length*blockSize, matrix.length*blockSize);
    let blocks = new Set();
    plane.position.set((matrix[0].length*blockSize)/2-blockSize/2,0,(matrix.length*blockSize)/2-blockSize/2);
    plane.rotateX(Math.PI/2);
    scene.add(plane);
    
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            if (matrix[i][j] == 1) {
                let block = getBlock(matrixToWorld(i, j));
                block.castShadow = true;
                block.reciveShadow = true;
                scene.add(block);
                matrix[i][j] = block;
                blocks.add(block);
                block.colliderComponent = new AABBCollider(block, blockSize, blockSize);
                block.isBlock = true;
            }
        }
    }
    return blocks;
}

function getBlock(pos) {
    const blockGeometry = new THREE.BoxGeometry(blockSize,blockSize,blockSize);
    // alterar cor de acordo com nivel
    let material = new THREE.MeshLambertMaterial({
        color:"rgb(50,50,50)"     // Main color of the object
    });
    
    const mesh = new THREE.Mesh(blockGeometry, material);
        mesh.position.set(pos.x, pos.y, pos.z);
    
    return mesh;
}

function getSpotLightMesh(){
    var loader = new GLTFLoader( );
    let mesh = new THREE.Object3D();    
    loader.load( './Models/lightPost.glb', function ( gltf ) {
        mesh.add(gltf.scene);
        mesh.castShadow = true;
    }); 
    return mesh
}

function matrixToWorld(i, j) {
    //return new THREE.Vector3(j*blockSize-(matrix[0].length-blockSize/2), blockSize/2, i*blockSize-(matrix.length-blockSize/2));
    let pos = new Vector3(j*blockSize, blockSize/2, i*blockSize);
    return pos;
}

/**
 * @param {Vector2} pos 
 */
export function worldToMatrix(pos) {
    let mPos = {
        i: Math.floor(pos.x/blockSize),
        j: Math.floor(pos.z/blockSize)
    }
    return mPos;
}

