import * as THREE from 'three';
import { GLTFLoader } from '../../build/jsm/loaders/GLTFLoader.js';
import Tank from '../Models/Tank.js';
import Cannon from '../Models/Cannon.js';
import { createGroundPlane } from '../../libs/util/util.js';
import MainCamera from './MainCamera.js';
import { OrbitControls } from '../../build/jsm/controls/OrbitControls.js';
import {
   initRenderer,
   initCamera,
   onWindowResize, } from "../../libs/util/util.js";
import { Vector2, Vector3 } from '../../build/three.module.js';
import AABBCollider from '../Physics/AABBCollider.js';

const blockSize = 2;

export function buildLevel(nLvl, scene, updateList, physics){
    if(nLvl==1){
        level1(scene, updateList, physics);
    }
    if(nLvl==2){
        level2(scene, updateList, physics);
    }
}

function level1(scene, updateList, physics){
    // Fazer cena?

    // Fazer camera?

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

    let blueTank = new Tank(5, 27, "Blue", 1);
    scene.add(blueTank.geometry);
    physics.add(blueTank.colliderComponent); 
    updateList.push(blueTank);

}

function level2(scene, updateList, physics){
    // Fazer cena?

    // Fazer camera?
    
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
    let ambientColor = "rgb(30,30,30)";
    let ambientLight = new THREE.AmbientLight(ambientColor);
    scene.add(ambientLight);

    let dirColor = "rgb(80,80,80)";
    let dirLight = new THREE.DirectionalLight(dirColor, 0.2);
    scene.add(dirLight);

    let spotLightMesh = getSpotLightMesh();
    let spotLightMesh2 = getSpotLightMesh();
    let spotLightMesh3 = getSpotLightMesh();
    let spotLightMesh4 = getSpotLightMesh();

    spotLightMesh.position.set(22,2,1);
    spotLightMesh2.position.set(0,2,17);
    spotLightMesh3.position.set(22,2,17);
    spotLightMesh4.position.set(0.5,2,33);

    spotLightMesh.rotateY(THREE.MathUtils.degToRad(-55));
    spotLightMesh2.rotateY(THREE.MathUtils.degToRad(90));
    spotLightMesh3.rotateY(THREE.MathUtils.degToRad(-90));
    spotLightMesh4.rotateY(THREE.MathUtils.degToRad(-55));

    scene.add(spotLightMesh)
    scene.add(spotLightMesh2)
    scene.add(spotLightMesh3)
    scene.add(spotLightMesh4)

    let spotLight = new THREE.SpotLight("rgb(255,255,255)");
    spotLight.position.copy(spotLightMesh.position);
    spotLight.distance = 0;
    spotLight.penumbra = 0.7;
    spotLight.intensity = 10;
    // spotLight.angle= THREE.MathUtils.degToRad(40);
    scene.add(spotLight);
    
    let spotLight2 = new THREE.SpotLight("rgb(255,255,255)");
    spotLight2.position.copy(spotLightMesh2.position);
    spotLight2.distance = 0;
    spotLight2.penumbra = 0.7;
    spotLight2.intensity = 10;
    // spotLight2.angle= THREE.MathUtils.degToRad(40);
    scene.add(spotLight2);

    let spotLight3 = new THREE.SpotLight("rgb(255,255,255)");
    spotLight3.position.copy(spotLightMesh3.position);
    spotLight3.distance = 0;
    spotLight3.penumbra = 0.7;
    spotLight3.intensity = 10;
    // spotLight3.angle= THREE.MathUtils.degToRad(40);
    scene.add(spotLight3);

    let spotLight4 = new THREE.SpotLight("rgb(255,255,255)");
    spotLight4.position.copy(spotLightMesh4.position);
    spotLight4.distance = 0;
    spotLight4.penumbra = 0.7;
    spotLight4.intensity = 10;
    // spotLight4.angle= THREE.MathUtils.degToRad(40);
    scene.add(spotLight4);
        

    // Adiciona os tanques
    let greenTank = new Tank(18, 4, "", 3);
    scene.add(greenTank.geometry);
    physics.add(greenTank.colliderComponent); 
    updateList.push(greenTank);
    
    let redTank = new Tank(4, 30, "Red", 1);
    scene.add(redTank.geometry);
    physics.add(redTank.colliderComponent); 
    updateList.push(redTank);

    let blueTank = new Tank(18, 30, "Blue", 2.5);
    scene.add(blueTank.geometry);
    physics.add(blueTank.colliderComponent); 
    updateList.push(blueTank);

    // Adiciona o canhao
    let cannon = new Cannon(11, 17);
    scene.add(cannon.geometry);
    scene.physics.add(cannon.colliderComponent); 
    scene.updateList.push(cannon);
}

function buildMap(scene, matrix) {
    //let plane = createGroundPlaneXZ(matrix[0].length*blockSize, matrix.length*blockSize)
    let plane = createGroundPlane(matrix[0].length*blockSize, matrix.length*blockSize);
    let blocks = new Set();
    plane.position.set((matrix[0].length*blockSize)/2-blockSize/2,0,(matrix.length*blockSize)/2-blockSize/2);
    plane.rotateX(Math.PI/2);
    scene.add(plane);

    // definir cor do bloco de acordo com o nivel
    
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            if (matrix[i][j] == 1) {
                let block = getBlock(matrixToWorld(i, j));
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
    loader.load( './Models/spotLightLamp.glb', function ( gltf ) {
        let obj = gltf.scene;
        let removeChild;
        obj.traverse( (child) => {
            if(child.name == "Floor"){
                removeChild = child;
            }
        });
        removeChild.parent.remove(removeChild);
        mesh.add(gltf.scene);
        mesh.castShadow = true;
    });
    let scale = 1.25
    mesh.scale.set(scale, scale, scale);
    
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

