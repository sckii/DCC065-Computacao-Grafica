import * as THREE from  'three';

class TankAI {
  constructor(tank, range) {
    this.tank = tank;
    this.range = range;
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

  setTankDirection() {
    const { minX, maxX, minZ, maxZ } = this.calculatePlayerRange();
    
    console.log(this.tank.position)

    if (this.tank.position.x > this.playerTank.position.x && 
        this.tank.position.z > this.playerTank.position.z &&
        this.tank.position.x < maxX && 
        this.tank.position.z < maxZ) {
      this.tank.position.add(new THREE.Vector3(0.1, 0, 0.1));
    }
    if (this.tank.position.x < this.playerTank.position.x && 
        this.tank.position.z > this.playerTank.position.z &&
        this.tank.position.x > minX && 
        this.tank.position.z < maxZ) {
      this.tank.position.add(new THREE.Vector3(-0.1, 0, 0.1));
    }
    if (this.tank.position.x < this.playerTank.position.x && 
        this.tank.position.z < this.playerTank.position.z &&
        this.tank.position.x > minX && 
        this.tank.position.z > minZ) {
      this.tank.position.add(new THREE.Vector3(-0.1, 0, -0.1));
    }
    if (this.tank.position.x > this.playerTank.position.x && 
        this.tank.position.z < this.playerTank.position.z &&
        this.tank.position.x < maxX && 
        this.tank.position.z > minZ) {
      this.tank.position.add(new THREE.Vector3(0.1, 0, -0.1));
    }
    if ((this.tank.position.x == this.playerTank.position.x || 
        this.tank.position.z == this.playerTank.position.z) &&
        this.tank.position.x < maxX && 
        this.tank.position.z > minZ) {
      this.tank.position.add(new THREE.Vector3(0.1, 0, 0));
    }
    console.log(this.calculatePlayerRange())
  }


  update() {
    this.setTankDirection();
  }
};

export default TankAI;