import * as THREE from 'three';
import { createGroundPlane } from '../../libs/util/util.js';
import { Vector2, Vector3 } from '../../build/three.module.js';

const blockSize = 1;

        
    
export function buildMap(scene, matrix) {
    //let plane = createGroundPlaneXZ(matrix[0].length*blockSize, matrix.length*blockSize)
    let plane = createGroundPlane(matrix[0].length*blockSize, matrix.length*blockSize)
    plane.position.set((matrix[0].length*blockSize)/2-blockSize/2,0,(matrix.length*blockSize)/2-blockSize/2);
    plane.rotateX(Math.PI/2);
    scene.add(plane);

    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            if (matrix[i][j] == 1) {
                let block = getBlock(matrixToWorld(i, j));
                scene.add(block);
                matrix[i][j] = block;
            }
        }
    }
}

function getBlock(pos) {
    const blockGeometry = new THREE.BoxGeometry(blockSize,blockSize,blockSize);
    const material = new THREE.MeshStandardMaterial();
        material.color = new THREE.Color("rgb(100,100,100)");
    
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
    let mPos = new Vector2(Math.floor(pos.x/blockSize), Math.floor(pos.z/blockSize));
    return mPos;
}
