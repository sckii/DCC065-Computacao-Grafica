import * as THREE from  'three';

function Tank(x, y, z, color)  {
    var geometry = new THREE.BoxGeometry(2, 2, 2);

    var material = new THREE.MeshPhongMaterial({color, shininess:"200"});
        material.side = THREE.DoubleSide;
   
    var obj = new THREE.Mesh(geometry, material);
        obj.castShadow = true;
        obj.position.set(x, y, z);
    
    return obj;
};

export default Tank;