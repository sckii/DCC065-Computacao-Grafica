import * as THREE from  'three';

const raycaster = new THREE.Raycaster();

class TankAI {
  constructor(tank, range, sceneBlocks, scene) {
    this.tank = tank;
    this.range = range;
    
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

  updateBotPosition() {
    const playerPosition =  this.playerTank.position; // Posição do jogador
    const botPosition = this.tank.position; // Posição do bot

    // Calcula a distancia
    const distanceBetweenPlayer = playerPosition.distanceTo(botPosition);

    if (distanceBetweenPlayer < this.range) {
      // Calcular a direção do player ao bot
      const direction = botPosition.clone().sub(playerPosition).normalize();

      // Calcular a rotação desejada (virar o bot para a direção oposta ao player)
      const targetRotation =  Math.atan2(direction.x, direction.z) + Math.PI/2
      
      // Suavizar a rotação do bot
      this.tank.geometry.rotation.y = targetRotation
    }
  }

  movement() {
    const playerPosition =  this.playerTank.position; // Posição do jogador
    const botPosition = this.tank.position; // Posição do bot

    // Calcula a distancia
    const distanceBetweenPlayer = playerPosition.distanceTo(botPosition);

    if (distanceBetweenPlayer)
      this.updateBotPosition();

    if (this.tank.normal) {
      const normal = this.normalQuandrant(this.tank.normal);
      this.tank.geometry.rotation.y = THREE.MathUtils.degToRad(normal);
      this.tank.normal = null;
      this.tank.setDir(1);
    }

    // if (this.getChancesOf(10)) {
    //   this.tank.geometry.rotateY(THREE.MathUtils.degToRad(-30));
    // }
    // if (this.getChancesOf(10)) {
    //   this.tank.geometry.rotateY(THREE.MathUtils.degToRad(30));
    // }

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

  ricochet() {
    const playerPosition =  this.playerTank.position; // Posição do jogador
    const botPosition = this.tank.position; // Posição do bot
    
    const direction = new THREE.Vector3();
    direction.subVectors(playerPosition, botPosition).normalize();
    
    raycaster.set(botPosition, direction);

    const intersects = raycaster.intersectObjects(this.sceneBlocks);

    if (intersects.length > 0) {
        // Ponto de impacto do ricochete
        const hitPoint = intersects[0].point;
        const normal = intersects[0].face.normal.clone();

        // Calcular a direção do ricochete (vetor refletido)
        const ricochetDirection = direction.reflect(normal);

        // Escolher um ponto mais adiante na direção do ricochete
        const bouncePoint = hitPoint.clone().add(ricochetDirection);

        return hitPoint;
    }

    return null; // Se não houver ponto de ricochete disponível
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
      const bouncePoint = this.ricochet();
      if (bouncePoint) {
        direction.subVectors(bouncePoint, botPosition).normalize();
        const targetRotation =  Math.atan2(direction.x, direction.z) - Math.PI/2
        
        this.tank.geometry.rotation.y = targetRotation
        this.tank.shoot(this.scene, this.updateList, this.physics);
      } else {
          console.error("Não foi possível calcular um ponto de ricochete");
          return;
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

  getChancesOf(chance) {
    let randomInt = Math.floor(Math.random() * 1000);
    return randomInt <= chance;
  }

  update() {
    
    this.movement();

    setInterval(() => {
      this.shoot();
    }, this.shootInterval - 1000);
    
  }
};

export default TankAI;