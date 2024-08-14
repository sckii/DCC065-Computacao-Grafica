import * as THREE from  'three';

class TankAI {
  constructor(tank, range, scene) {
    this.tank = tank;
    this.range = range;
    this.scene = scene;
  }

  setAITank() {
    this.tank = tank;
  }

  setPlayerTank(playerTank) {
    this.playerTank = playerTank;
  }

  calculatePlayerRange() {
    let minX, maxX, minZ, maxZ;

    const playerX = this.playerTank.position.x;
    const playerZ = this.playerTank.position.z;
    
    minX = playerX - this.range;
    maxX = playerX + this.range;

    minZ = playerZ - this.range;
    maxZ = playerZ + this.range;

    return {
      minX: minX,
      maxX: maxX,
      minZ: minZ,
      maxZ: maxZ,
    }
  }

  checkQuadrant() {
    const { minX, maxX, minZ, maxZ } = this.calculatePlayerRange();
    
    if ((this.tank.geometry.position.x >= this.playerTank.position.x && 
        this.tank.geometry.position.z >= this.playerTank.position.z) &&
        this.tank.geometry.position.x <= maxX && 
        this.tank.geometry.position.z <= maxZ) {
      return -45;
    }
    if (this.tank.geometry.position.x <= this.playerTank.position.x && 
        this.tank.geometry.position.z >= this.playerTank.position.z &&
        this.tank.geometry.position.x >= minX && 
        this.tank.geometry.position.z <= maxZ) {
      return -135;
    }
    if (this.tank.geometry.position.x <= this.playerTank.position.x && 
        this.tank.geometry.position.z <= this.playerTank.position.z &&
        this.tank.geometry.position.x >= minX && 
        this.tank.geometry.position.z >= minZ) {
      return 135;
    }
    if (this.tank.geometry.position.x >= this.playerTank.position.x && 
        this.tank.geometry.position.z <= this.playerTank.position.z &&
        this.tank.geometry.position.x <= maxX && 
        this.tank.geometry.position.z >= minZ) {
      return 45;
    }

    return false;
  }

  movement() {
    const quadarant = this.checkQuadrant();
    if (quadarant) {
      this.tank.geometry.rotation.y = THREE.MathUtils.degToRad(quadarant);
      this.tank.setDir(1);
    }
    if (this.tank.normal) {
      const normal = this.normalQuandrant(this.tank.normal);
      this.tank.geometry.rotation.y = THREE.MathUtils.degToRad(normal);
      this.tank.normal = null;
      this.tank.setDir(1);
    }

    if (this.getChancesOf(200)) {
      this.shoot();
      this.tank.setDir(1);
      if (this.getChancesOf(100)) {
        this.tank.geometry.rotateY(THREE.MathUtils.degToRad(-30))
      }
      if (this.getChancesOf(20)) {
        this.tank.geometry.rotateY(THREE.MathUtils.degToRad(30))
      }
    }
  }

  shoot() {
  }

  normalQuandrant(normal) {
    if (normal.x > 0 && normal.z === 0) {
      return 180;
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
  }
};

export default TankAI;