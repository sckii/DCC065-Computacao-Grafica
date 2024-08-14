import * as THREE from 'three';
import { createGroundPlane } from '../../libs/util/util.js';
import { Vector2, Vector3 } from '../../build/three.module.js';
import AABBCollider from '../Physics/AABBCollider.js';

const blockSize = 2;

export function buildLevel(nLvl = 1, scene, updateList, physics){
    const matrixLvl = getMatrixLvl(nLvl);
    let blocks = buildMap(scene, matrixLvl, updateList, physics);
    physics.addToMap(blocks);
}
    
function buildMap(scene, matrix, updateList, physics) {
    //let plane = createGroundPlaneXZ(matrix[0].length*blockSize, matrix.length*blockSize)
    let plane = createGroundPlane(matrix[0].length*blockSize, matrix.length*blockSize);
    let blocks = new Set();
    plane.position.set((matrix[0].length*blockSize)/2-blockSize/2,0,(matrix.length*blockSize)/2-blockSize/2);
    plane.rotateX(Math.PI/2);
    scene.add(plane);

    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            if (matrix[i][j] == 1) {
                let block = getBlock(matrixToWorld(i, j));
                scene.add(block);
                matrix[i][j] = block;
                blocks.add(block);
                block.colliderComponent = new AABBCollider(block, blockSize, blockSize);
                block.isBlock = true;

                // if ( (i + j) % 2 == 0)
                //     block.material.color = new Color(.3,.3,.3);
                // else
                //     block.material.color = new Color(.1,.1,.1);
            }
            if (matrix[i][j] == -1){
                buildTank(scene, updateList, physics);
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

function buildTank(scene, updateList, physics, color){
    
}

function getMatrixLvl(nLvl){
    let matrixLvl;
    if(nLvl == 1){
        matrixLvl = [
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
    }
    if(nLvl == 2){
        matrixLvl = [
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
    }
    return matrixLvl;
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

