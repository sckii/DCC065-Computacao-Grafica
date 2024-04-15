export let scene;

export function setScene(s) {
    scene = s;
}

export function removerDaScene(obj){
      
    scene.remove(obj.mesh);
    obj.mesh = null;
    const index = scene.updateList.indexOf(obj);
    if (index > -1) { // only splice array when item is found
       scene.updateList.splice(index, 1); // 2nd parameter means remove one item only
    }
    //physics.remove(obj.colliderComponent);

}