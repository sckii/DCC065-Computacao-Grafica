import AABBCollider from "../Physics/AABBCollider";

class PowerUp{ 
    constructor(currentLevel, scene){

        this.position = this.getPosition(currentLevel);
        this.type = this.getType();
        this.geometry = this.buildMesh(this.position.x, this.position.z);
        this.isActive = false;
        // Colisão
        this.colliderComponent = new AABBCollider(this, 1,1);

        this.startSpawn(scene);
        
    }
    startSpawn(scene){
        // Função que será chamada a cada 10 segundos
        if(!scene.activePowerUp.isActive){
            this.spawInterval = setInterval(() => {
                this.spawn(scene);
            }, 10000);
        }
    }
    spawn(scene){
        this.position = this.getPosition(currentLevel);
        this.type = this.getType();
        this.geometry = this.buildMesh(this.position.x, this.position.z);
        this.isActive = true;
        scene.add(this.geometry);
        scene.physics.add(this.colliderComponent); 
        scene.updateList.push(this);
    }

    buildMesh(x, z){
        if(this.type == 1){         //healing
            const geometry = new THREE.CapsuleGeometry( 1, 1, 4, 8 ); 
            const material = new THREE.MeshBasicMaterial( {color: 0x00ff00} ); 
            const capsule = new THREE.Mesh( geometry, material );
            capsule.position.set(x, 1, z);
            return capsule;
        }
        if(this.type == 2){         //tiro
            const geometry = new THREE.IcosahedronGeometry(10,0); 
            const material = new THREE.MeshBasicMaterial( {color: 0x00ff00} ); 
            const icosahedron = new THREE.Mesh( geometry, material );
            icosahedron.position.set(x, 1, z);
            return icosahedron;
            
        }
    }

    getPosition(currentLevel){  
        if(currentLevel == 1){
            let coordinates = [
                { x: 5, z: 5 },
                { x: 5, z: 26 },
                { x: 16, z: 5 },
                { x: 16, z: 26 },
                { x: 11, z: 16 }
            ];
            let randomIndex = Math.floor(Math.random() * coordinates.length);
            return coordinates[randomIndex];
        }
        if(currentLevel == 2){
            let coordinates = [
                { x: 10, z: 20 },
                { x: 30, z: 40 },
                { x: 50, z: 60 },
                { x: 70, z: 80 },
                { x: 90, z: 100 }
            ];
            
            let randomIndex = Math.floor(Math.random() * coordinates.length);
            return coordinates[randomIndex];
        }
        if(currentLevel == 3){
            let coordinates = [
                { x: 10, z: 20 },
                { x: 30, z: 40 },
                { x: 50, z: 60 },
                { x: 70, z: 80 },
                { x: 90, z: 100 }
            ];
            
            let randomIndex = Math.floor(Math.random() * coordinates.length);
            return coordinates[randomIndex];
        }
    }

    getType(){
        let types = [
            1,          // healing
            2           // tiro
            ];
        
        let randomIndex = Math.floor(Math.random() * types.length);
        return types[randomIndex];
    }
    /**
     * Esse método é chamado quando esse objeto entra em colisão com outro.
     * @param {Collision} collision 
     */
    onCollisionEntered(collision) {
        
    }

    /**
     * Esse método é chamado quando um objeto para de colidir com este
     * @param {Collider} other 
     */
    onCollisionExit(other) {
        
    }

    update() {
        // rodar
    }

}   export default PowerUp;