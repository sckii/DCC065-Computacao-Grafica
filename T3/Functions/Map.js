import * as THREE from 'three';
import { GLTFLoader } from '../../build/jsm/loaders/GLTFLoader.js';
import Tank from '../Models/Tank.js';
import Cannon from '../Models/Cannon.js';
import { createGroundPlane } from '../../libs/util/util.js';
import { DirectionalLightHelper, Vector2, Vector3 } from '../../build/three.module.js';
import AABBCollider from '../Physics/AABBCollider.js';
import TankAI from './TankIA.js';
import GameScene from '../Models/GameScene.js';
import { getRenderer } from './SceneGlobals.js';
import { CSG } from '../../libs/other/CSGMesh.js'        

const blockSize = 2;

export function buildLevel(nLvl){
    if(nLvl==1){
        return level1();
    }
    if(nLvl==2){
        return level2();
    }
}

function level1(){
    let scene = new GameScene( getRenderer() );

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
    let blockMaterial = new THREE.MeshLambertMaterial({
        color:"rgb(178,34,34)"    
    });
    let blocks = buildMap(scene, matrixLvl1, blockMaterial);
    scene.physics.addToMap(blocks);

    // Iluminacao
    let ambientColor = "rgb(135, 206, 250)";
    let ambientLight = new THREE.AmbientLight(ambientColor, .2);

    const dirLightTarget = new THREE.Object3D(); 
    dirLightTarget.position.set(10,0,20)
    scene.add(dirLightTarget);

    const dirPosition = new THREE.Vector3(30, 35, 30);
    const dirLight = new THREE.DirectionalLight("rgb(255,250,224)", 1);
        dirLight.target = dirLightTarget;
        dirLight.position.copy(dirPosition);
        dirLight.castShadow = true;
        dirLight.shadow.camera.left = -30;
        dirLight.shadow.camera.right = 30;
        dirLight.shadow.camera.bottom = -30;
        dirLight.shadow.camera.top = 30;
    scene.add(dirLight);  

    scene.add(ambientLight);

    // Adiciona os tanques
    let redTank = new Tank(5, 5, "Red", 1);
    scene.add(redTank.geometry);
    scene.physics.add(redTank.colliderComponent); 
    scene.updateList.push(redTank);
    scene.tankList.push(redTank);
    scene.playerTank = redTank;

    let blueTank = new Tank(5, 27, "Blue", 1);
    blueTank.ai = new TankAI(blueTank, scene.playerTank, 10, blocks, scene);
    scene.add(blueTank.geometry);
    scene.physics.add(blueTank.colliderComponent); 
    scene.updateList.push(blueTank);
    scene.tankList.push(blueTank);
    
    // AI
    scene.bots = [blueTank];

    return scene;
}

function level2(){
    let scene = new GameScene( getRenderer() );
    
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
        [1, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ]
    let blockMaterial = new THREE.MeshLambertMaterial({
        color:"rgb(255,182,193)"    
    });
    let blocks = buildMap(scene, matrixLvl2, blockMaterial);

    // cria a caixa central
    let supportBox = new THREE.Mesh(new THREE.BoxGeometry(2*blockSize, blockSize*0.3, 2*blockSize));
    let subtractCylinder = new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.3, blockSize*0.3, 32));
    
    let csgMiddleBox = CSG.fromMesh(supportBox).subtract(CSG.fromMesh(subtractCylinder));
    let middleBox = CSG.toMesh(csgMiddleBox, new THREE.Matrix4(), blockMaterial);
    middleBox.position.set(11,0.2,17)
    scene.add(middleBox)
    scene.physics.addToMap(blocks);

    // Iluminacao
    // Luz ambiente
    let ambientColor = "rgb(25,25,75)";
    let ambientLight = new THREE.AmbientLight(ambientColor, .2);
    scene.add(ambientLight);

    // Luz direcional
    const dirLightTarget = new THREE.Object3D(); 
    dirLightTarget.position.set(10,0,20)
    scene.add(dirLightTarget);

    const dirPosition = new THREE.Vector3(30, 35, 30);
    const dirLight = new THREE.DirectionalLight("rgb(83,87,88)", .2); //0.2
        dirLight.target = dirLightTarget;
        dirLight.position.copy(dirPosition);
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
    scene.physics.add(greenTank.colliderComponent); 
    scene.updateList.push(greenTank);
    scene.tankList.push(greenTank)
    scene.playerTank = greenTank;
    
    let redTank = new Tank(4, 30, "Red", 1);
    redTank.ai = new TankAI(redTank, scene.playerTank, 10, blocks, scene);
    scene.add(redTank.geometry);
    scene.physics.add(redTank.colliderComponent); 
    scene.updateList.push(redTank);
    scene.tankList.push(redTank);

    let blueTank = new Tank(18, 30, "Blue", 2.5);
    blueTank.ai = new TankAI(blueTank, scene.playerTank, 10, blocks, scene);
    scene.add(blueTank.geometry);
    scene.physics.add(blueTank.colliderComponent); 
    scene.updateList.push(blueTank);
    scene.tankList.push(blueTank);
    
    // Adiciona o canhao
    let cannon = new Cannon(11, 17, scene);
    scene.add(cannon.geometry);
    scene.physics.add(cannon.colliderComponent); 
    scene.updateList.push(cannon);

        
    // AI
    blocks.add(blueTank.mesh);
    blocks.add(redTank.mesh);

    scene.bots = [blueTank, redTank];

    return scene;
}

export function buildMap(scene, matrix, blockMaterial) {
    let plane = createGroundPlane(matrix[0].length*blockSize, matrix.length*blockSize);
    let blocks = new Set();
    plane.position.set((matrix[0].length*blockSize)/2-blockSize/2,0,(matrix.length*blockSize)/2-blockSize/2);
    plane.rotateX(Math.PI/2);
    scene.add(plane);
    
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            if (matrix[i][j] == 1) {
                let block = getBlock(matrixToWorld(i, j), blockMaterial, 1);
                block.castShadow = true;
                block.reciveShadow = true;
                scene.add(block);
                matrix[i][j] = block;
                blocks.add(block);
                block.colliderComponent = new AABBCollider(block, blockSize, blockSize);
                block.isBlock = true;
            }
            if (matrix[i][j] == 2) {
                let halfBlock = getBlock(matrixToWorld(i, j), blockMaterial, 2);
                halfBlock.position.setY(.5);
                halfBlock.castShadow = true;
                halfBlock.reciveShadow = true;
                //scene.add(halfBlock);
                matrix[i][j] = halfBlock;
                blocks.add(halfBlock);
                halfBlock.colliderComponent = new AABBCollider(halfBlock, blockSize, blockSize);
                halfBlock.isBlock = true;
            }
        }

        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[i].length; j++) {
                if (matrix[i][j].wallType == 2) {
                    matrix[i][j].material
                }
            }
        }
    }
    return blocks;
}

function getBlock(pos, blockMaterial, type) {
    let blockGeometry;
    
    if (type == 1) {
        blockGeometry = new THREE.BoxGeometry(blockSize,blockSize,blockSize);
    }
    else if (type == 2) {
        blockGeometry = new THREE.BoxGeometry(blockSize,blockSize*0.5,blockSize);
    }
    
    const mesh = new THREE.Mesh(blockGeometry, blockMaterial);
    mesh.position.set(pos.x, pos.y, pos.z);
    mesh.wallType = type;

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