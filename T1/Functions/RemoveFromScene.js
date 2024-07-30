export let scene;

export function setScene(s) {
    scene = s;
}

export function removeFromScene(obj){
      
    scene.remove(obj.mesh);
    obj.mesh = null;
    const index = scene.updateList.indexOf(obj);
    if (index > -1) { 
       scene.updateList.splice(index, 1);
    }
    scene.physics.remove(obj.colliderComponent);

}