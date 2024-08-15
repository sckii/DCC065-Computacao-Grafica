import * as THREE from 'three';
import Tank from '../Models/Tank.js';
import Cannon from '../Models/Cannon.js';
import { createGroundPlane } from '../../libs/util/util.js';
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

    // Fazer iluminacao

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

    // Fazer iluminacao

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
    let material = new THREE.MeshLambertMaterial({
        color:"rgb(50,50,50)"     // Main color of the object
    });
    
    const mesh = new THREE.Mesh(blockGeometry, material);
        mesh.position.set(pos.x, pos.y, pos.z);
    
    return mesh;
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

