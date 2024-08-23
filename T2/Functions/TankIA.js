
import * as THREE from  'three';
import { getChancesOf, rotateObjectToVector } from './Utils.js';

const raycaster = new THREE.Raycaster();

class TankAI {

  constructor(tank, playerTank, range, sceneBlocks, scene) {
    this.tank = tank;
    this.playerTank = playerTank.geometry;
    this.playerTankMesh = playerTank.mesh;
    this.range = 7;

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
    this.shootInterval = 4000;

    this.scene = scene;
    this.updateList = scene.updateList;
    this.physics = scene.physics;
  }

  getOutPlayer() {
    if (!this.canRun) return;
    this.canRun = false;

    const playerPosition =  this.playerTank.position; // Posição do jogador
    const botPosition = this.tank.position; // Posição do bot

    // Calcula a distancia
    const distanceBetweenPlayer = playerPosition.distanceTo(botPosition);

    if (distanceBetweenPlayer < this.range) {
      this.canCatch = false;
      // Calcular a direção do player ao bot
      const direction = botPosition.clone().sub(playerPosition).normalize();

      // Calcular a rotação desejada (virar o bot para a direção oposta ao player)
      rotateObjectToVector(this.tank.geometry, direction)
      this.tank.setDir(1);
    }

    setTimeout(() => {
      this.canRun = true;
    }, this.canRunInterval);
  }
  
  turn() {
    if (this.turnTimes % 10 === 0) {
      this.getOutWallAngle = -1 * this.getOutWallAngle;
    }
    this.turnTimes++;
  }

  getOutOfWall() {
    const botPosition = this.tank.position.clone(); // Posição do bot

    const nearWall = {
      direction: null,
    }

    botPosition.setY(0.1)
    const direction = this.tank.geometry.getWorldDirection(new THREE.Vector3(1, 0.1, 0));
    direction.normalize(); // Normalizar o vetor de direção

    const raycaster = new THREE.Raycaster();
    raycaster.set(botPosition, direction);
    const obstacles = raycaster.intersectObjects(this.sceneBlocks, true);

    
    // Detectar obstáculos dentro de um alcance de 6 unidade
    if (obstacles.length > 0 && obstacles[0].distance < 6) {
        // this.scene.add(new THREE.ArrowHelper(direction, botPosition, obstacles[0].distance, 0xffff00));
        this.turn();
        this.tank.geometry.rotateY(THREE.MathUtils.degToRad(this.getOutWallAngle));
        this.tank.setDir(1);
    } else {
        // Não há obstáculos, continue na direção atual
        nearWall.direction = null; // Posição do bot
    }

    return nearWall;
  }

  movement() {
    if (!this.canCatch) return;
    this.canCatch = false;

    const playerPosition =  this.playerTank.position; // Posição do jogador
    const botPosition = this.tank.position; // Posição do bot
    const direction = new THREE.Vector3();

    direction.subVectors(playerPosition, botPosition).normalize();
    // Rotacionar o objeto para "olhar" na direção do vetor        
    rotateObjectToVector(this.tank.geometry, direction);
    this.tank.setDir(1);

    setTimeout(() => {
      this.canCatch = true;
    }, this.canCatchInterval);
  }

  isPlayerVisible() {
    const playerPosition =  this.playerTank.position; // Posição do jogador
    const botPosition = this.tank.position; // Posição do bot

    const direction = new THREE.Vector3();
    direction.subVectors(playerPosition, botPosition).normalize();

    raycaster.set(botPosition, direction);
    const intersects = raycaster.intersectObjects(this.sceneBlocks);
    
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
    if (!this.canShoot) return; // Se o bot não pode atirar, saia da função
    this.canShoot = false; // Impedir novos tiros até que o timeout acabe

    const playerPosition =  this.playerTank.position; // Posição do jogador
    const botPosition = this.tank.position; // Posição do bot

    const direction = new THREE.Vector3();
    
    if (this.isPlayerVisible()) {
      direction.subVectors(playerPosition, botPosition).normalize();
      // Rotacionar o objeto para "olhar" na direção do vetor        
      rotateObjectToVector(this.tank.geometry, direction);
      this.tank.shoot(this.scene, this.updateList, this.physics);

    } else {
      // Se o player não estiver visível, calcule uma trajetória com ricochete
      const ricochetDirection = this.calculateRicochet().direction;
      if (ricochetDirection) {        
        // Rotacionar o objeto para "olhar" na direção do vetor        
        rotateObjectToVector(this.tank.geometry, ricochetDirection);
        this.tank.shoot(this.scene, this.updateList, this.physics);
      }
    }

    setTimeout(() => {
      this.canShoot = true;
    }, this.shootInterval)
  }

 
  update() {
    if (!this.canShoot) {
      // PATRULHAR
      this.getOutPlayer();
      this.movement();
      this.tank.setDir(1);
    }
    // MOVIMENTAR
    this.getOutOfWall();

    // ATIRAR
    setTimeout(() => {
      if(!this.tank.isDead)
        this.shoot();
    }, 1000)

  }
};

export default TankAI;