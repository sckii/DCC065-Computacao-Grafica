import * as THREE from  'three';
import { convertVector3ToEuler, getChancesOf } from './Utils.js';

const raycaster = new THREE.Raycaster();

class TankAI {
  constructor(tank, range, sceneBlocks, scene) {
    this.tank = tank;
    this.range = range;

    // Tank Movement
    this.canMoveForward = true;
    
    // Tank Aim
    this.sceneBlocks = [];
    sceneBlocks.forEach(e => this.sceneBlocks.push(e));
    
    // Tank Shoot
    this.canShoot = true;
    this.shootInterval = 2000;

    this.scene = scene;
    this.updateList = scene.updateList;
    this.physics = scene.physics;
  }

  setAITank() {
    this.tank = tank;
  }

  setPlayerTank(playerTank) {
    this.playerTank = playerTank;
  }

  getOutPlayer() {
    const playerPosition =  this.playerTank.position; // Posição do jogador
    const botPosition = this.tank.position; // Posição do bot

    // Calcula a distancia
    const distanceBetweenPlayer = playerPosition.distanceTo(botPosition);

    if (distanceBetweenPlayer < this.range) {
      // Calcular a direção do player ao bot
      const direction = botPosition.clone().sub(playerPosition).normalize();

      // Calcular a rotação desejada (virar o bot para a direção oposta ao player)
      const targetRotation =  Math.atan2(direction.x, direction.z) - Math.PI/2
      
      // Suavizar a rotação do bot
      this.tank.geometry.rotation.y = targetRotation
      this.tank.setDir(1);
    }
  }

  movement() {
    const playerPosition =  this.playerTank.position; // Posição do jogador
    const botPosition = this.tank.position; // Posição do bot

    // Mantem afastado do jogador 
    this.getOutPlayer();

    // TODO: Validar funcionamento
    if (this.tank.normal) {
      const normal = this.normalQuandrant(this.tank.normal);
      this.tank.geometry.rotation.y = THREE.MathUtils.degToRad(normal);
      this.tank.normal = null;
      this.tank.setDir(1);
    }

    const distanceBetweenPlayer = playerPosition.distanceTo(botPosition);
    if (distanceBetweenPlayer > this.range && !this.tank.normal) {
      if (getChancesOf(10)) {
        this.tank.geometry.rotateY(THREE.MathUtils.degToRad(-30));
      }
      if (getChancesOf(10)) {
        this.tank.geometry.rotateY(THREE.MathUtils.degToRad(30));
      }
    }

    this.tank.setDir(1)
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
      distanceToPlayer: Infinity,
    }

    // Direções a serem testadas
    const rayDirections = this.generateRayDirections();
    rayDirections.forEach(rayDirection => {
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
        const playerIntersect = ricochetRaycaster.intersectObject(this.playerTank);
        
        if (playerIntersect.length > 0) {
          const distanceToPlayer = playerIntersect[0].distance;

          // Verificar se é a melhor trajetoria até o player
          if (distanceToPlayer < bestRicochet.distanceToPlayer) {
            bestRicochet.direction = rayDirection;
            bestRicochet.distanceToPlayer = distanceToPlayer;
          }
        }
      }
    })
  
    return bestRicochet;
  }

  generateRayDirections() {
    const rayDirections = [];
    const degreeIncrement = 10; // Incremento em graus

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
      const targetRotation =  Math.atan2(direction.x, direction.z) - Math.PI/2;

      this.tank.geometry.rotation.y = targetRotation
      this.tank.shoot(this.scene, this.updateList, this.physics);
    } else {
      // Se o player não estiver visível, calcule uma trajetória com ricochete
      const ricochetDirection = this.calculateRicochet().direction;

      
      if (ricochetDirection) {
        const euler = convertVector3ToEuler(ricochetDirection);

        this.tank.geometry.rotation.copy(euler)
        this.tank.shoot(this.scene, this.updateList, this.physics);
      }
    }

    setTimeout(() => {
      this.canShoot = true;
    }, this.shootInterval)
  }

  normalQuandrant(normal) {
    if (normal.x > 0 && normal.z === 0) {
      return 0;
    }
    if (normal.x === 0 && normal.z > 0) {
      return -90;
    }
    if (normal.x < 0 && normal.z === 0) {
      return -180;
    }
    if (normal.x === 0 && normal.z < 0) {
      return 90;
    }
    return false
  }

  

  update() {
    
    this.movement();

    if (this.canShoot) {
      this.tank.setDir(0)
    }

    setInterval(() => {
      this.shoot();
    }, this.shootInterval - 1000);
    
  }
};

export default TankAI;