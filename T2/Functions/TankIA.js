
import * as THREE from  'three';
import { getChancesOf, rotateObjectToVector } from './Utils.js';
import { getCurrentScene } from './SceneGlobals.js';

const raycaster = new THREE.Raycaster();

class TankAI {

  constructor(tank, playerTank, range, sceneBlocks, scene) {
    this.tank = tank;
    this.playerTank = playerTank.geometry;
    this.playerTankMesh = playerTank.mesh;
    this.range = 7;
    this.shootingRange = 12;

    // Tank Movement
    this.canRun = true;
    this.canRunInterval = 500;
    
    this.canCatch = true;
    this.canCatchInterval = 8000;

    this.turnTimes = 0;
    this.getOutWallAngle = 30;
    
    // Tank Aim
    this.sceneBlocks = [];
    sceneBlocks.forEach(e => this.sceneBlocks.push(e));
    
    // Tank Shoot
    this.canShoot = true;
    this.shootInterval = 50000;

    this.scene = scene;
    this.updateList = scene.updateList;
    this.physics = scene.physics;

    this.turning = "false";
    this.canShoot = true;
  }

  getOutPlayer() {
    this.tank.setDir(1);
    const playerPosition =  this.playerTank.position; // Posição do jogador
    const botPosition = this.tank.position; // Posição do bot

    // Calcula a distancia
    const distanceBetweenPlayer = playerPosition.distanceTo(botPosition);

    // Calcular a direção do player ao bot
    const direction = botPosition.clone().sub(playerPosition).normalize();

    // Calcular a rotação desejada (virar o bot para a direção oposta ao player)
    if (this.tank.worldDir.dot(direction) < 0 ) {
      if (this.tank.worldDir.angleTo(direction) > 0) {
        this.turning = "left";
      }
      if (this.tank.worldDir.angleTo(direction) < 0) {
        this.turning = "right";
      }
    } else {
      this.turning = false;
    }
  }
  
  turn() {
    if (this.turning == "left") {
      this.tank.geometry.rotateY(THREE.MathUtils.degToRad(5));
    } else if (this.turning == "right") {
      this.tank.geometry.rotateY(THREE.MathUtils.degToRad(-5));
    }
  }

  getOutOfWall() {
    let limit = 7;
    const botPosition = this.tank.position.clone(); // Posição do bot

    const direction = this.tank.geometry.getWorldDirection(new THREE.Vector3(1, 0, 0));
    direction.normalize(); // Normalizar o vetor de direção
    
    const raycaster = new THREE.Raycaster();
    const leftRightAxis = new THREE.Vector3(-direction.z,0, direction.x);
    // Left Ray
    const leftRayPos = botPosition.clone()
    const leftRayDir = direction.clone()
    const angle = 10 * (Math.PI / 180);
    const axis = new THREE.Vector3(0, 1, 0);
      leftRayDir.applyAxisAngle( axis, angle );
    leftRayPos.add(leftRightAxis.clone().multiplyScalar(-1));
    
    raycaster.set(leftRayPos, leftRayDir);
    const obstaclesLeft = raycaster.intersectObjects(this.sceneBlocks, true);
    console.log(leftRayDir);
    
    // Right Ray
    const rightRayPos = botPosition.clone()
    const rightRayDir = direction.clone()
      rightRayDir.applyAxisAngle( axis, -angle );
    rightRayPos.add(leftRightAxis.clone().multiplyScalar(1));
    
    raycaster.set(rightRayPos, rightRayDir);
    const obstaclesRight = raycaster.intersectObjects(this.sceneBlocks, true);

    this.scene.add(new THREE.ArrowHelper(rightRayDir, rightRayPos, obstaclesRight[0].distance, 0xffff00));
    this.scene.add(new THREE.ArrowHelper(leftRayDir, leftRayPos, obstaclesLeft[0].distance, 0xff0000));

    if (obstaclesLeft.length > 0 && obstaclesRight.length > 0) {
      if (obstaclesLeft[0].distance < limit || obstaclesRight[0].distance < limit) {
        //this.tank.setDir(0);
        if (this.turning == "false") {
  
          if (obstaclesLeft[0].distance > obstaclesRight[0].distance) {
            console.log("l");
            this.scene.add(new THREE.ArrowHelper(direction, rightRayPos, obstaclesRight[0].distance, 0xffff00));
            this.turning = "left";
          }
          else {
            console.log("r");
            this.scene.add(new THREE.ArrowHelper(direction, leftRayPos, obstaclesLeft[0].distance, 0xff0000));
            this.turning = "right";
          }
        }
      } else {
        this.turning = "false";
      }

    }
  }

  aimAtPlayer() {
    const playerPosition =  this.playerTank.position; // Posição do jogador
    const botPosition = this.tank.position; // Posição do bot
    const direction = new THREE.Vector3();

    direction.subVectors(playerPosition, botPosition).normalize();
    // Rotacionar o objeto para "olhar" na direção do vetor        
    //rotateObjectToVector(this.tank.geometry, direction);
    if (this.tank.worldDir.angleTo(direction) > 10) {
      this.turning = "left";
    }
    else if (this.tank.worldDir.angleTo(direction) < -10) {
      this.turning = "right";
    }
    else {
      this.turning = "false";
    }
  }

  isPlayerVisible() {
    const playerPosition =  this.playerTank.position; // Posição do jogador
    const botPosition = this.tank.position; // Posição do bot

    const direction = new THREE.Vector3();
    direction.subVectors(playerPosition, botPosition).normalize();

    raycaster.set(botPosition, direction);
    const intersects = raycaster.intersectObjects(this.sceneBlocks);
    //this.scene.add(new THREE.ArrowHelper(direction, botPosition, intersects[0].distance, 0xf0ff00))

    // Se não houver interseções ou se a primeira interseção estiver depois do player, o player é visível
    if (intersects.length === 0 || intersects[0].distance > botPosition.distanceTo(playerPosition)) {
      return true;
    }

    return false;
  }

  calculateRicochet() {
    const botPosition = this.tank.position; // Posição do bot

    const bestRicochet = {
      direction: null,
      angle: null
    }

    // Direções a serem testadas
    const rayDirections = this.generateRayDirections();
    rayDirections.forEach(rayDirection => {
      const rawDirection = new THREE.Vector3().copy(rayDirection)

      // Direciona o raio em uma das direções a serem testadas
      const raycaster = new THREE.Raycaster(botPosition, rayDirection);
      const intersects = raycaster.intersectObjects(this.sceneBlocks);
      

      if (intersects.length > 0) {
        const hitPoint = intersects[0].point;
        const normal = intersects[0].face.normal.clone();
        
        // Calcula a direção refletida
        const ricochetDirection = rayDirection.reflect(normal).normalize();
        
        // Cria um segundo raycaster para ver se acerta o player
        const ricochetRaycaster = new THREE.Raycaster(hitPoint, ricochetDirection);
        const playerIntersect = ricochetRaycaster.intersectObject(this.playerTankMesh);
        const wallIntersect = ricochetRaycaster.intersectObjects(this.sceneBlocks);
        
        if (playerIntersect.length > 0 && playerIntersect[0].distance < wallIntersect[0].distance) {
          // Verificar se é a melhor trajetoria até o player
          bestRicochet.direction = rawDirection
        }
      }
    })
  
    return bestRicochet;
  }

  generateRayDirections() {
    const rayDirections = [];
    const degreeIncrement = 5; // Incremento em graus

    // Iterar de 0 a 360 graus em incrementos de 10 graus
    for (let i = 0; i < 360; i += degreeIncrement) {
      const angle = THREE.MathUtils.degToRad(i);
      const x = Math.cos(angle); // Componente X
      const z = Math.sin(angle); // Componente Z
      rayDirections.push(new THREE.Vector3(x, 0, z).normalize()); // Vetor normalizado na direção
    }

    return rayDirections;
  }

  shoot() {
    const playerPosition =  this.playerTank.position; // Posição do jogador
    const botPosition = this.tank.position; // Posição do bot

    const direction = new THREE.Vector3();
    
    if (this.isPlayerVisible()) {
      direction.subVectors(playerPosition, botPosition).normalize();
      // Rotacionar o objeto para "olhar" na direção do vetor        
      //rotateObjectToVector(this.tank.geometry, direction);
      this.tank.shoot(this.scene, this.updateList, this.physics);

    } else {
      // Se o player não estiver visível, calcule uma trajetória com ricochete
      const ricochetDirection = this.calculateRicochet().direction;
      if (ricochetDirection) {        
        // Rotacionar o objeto para "olhar" na direção do vetor        
        //rotateObjectToVector(this.tank.geometry, ricochetDirection);
        this.tank.shoot(this.scene, this.updateList, this.physics);
      }
    }

    this.canShoot = false;
    setTimeout(() => {
      this.canShoot = true;
    }, this.shootInterval)
  }

  inPlayerRange() {
    const playerPosition =  this.playerTank.position; // Posição do jogador
    const botPosition = this.tank.position; // Posição do bot
    const playerDistance = botPosition.distanceTo(playerPosition);

    return playerDistance < this.range;
  }

  inShootingRange() {
    const playerPosition =  this.playerTank.position; // Posição do jogador
    const botPosition = this.tank.position; // Posição do bot
    const playerDistance = botPosition.distanceTo(playerPosition);

    return playerDistance < this.shootingRange;
  }

 
  update() {
    /* if (!this.canShoot) {
      // PATRULHAR
      this.getOutPlayer();
      this.movement();
      this.tank.setDir(1);
    }
    // MOVIMENTAR
    this.getOutOfWall(); */

    const playerPosition =  this.playerTank.position; // Posição do jogador
    const botPosition = this.tank.position; // Posição do bot
    const playerDistance = botPosition.distanceTo(playerPosition);

    if (this.inPlayerRange()) {
      this.getOutPlayer();
      this.tank.setDir(1);
    } 
    else {
      if (this.isPlayerVisible() && this.turning == "false") {
        this.aimAtPlayer();
      }
      if (this.inShootingRange()) {
        if (this.canShoot) {
          this.shoot();
        }
      }
      else {
        this.getOutOfWall();
        this.tank.setDir(1);
      }
    }
    this.turn();
  }
};

export default TankAI;