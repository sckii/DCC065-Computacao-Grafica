import {removeFromScene } from './RemoveFromScene.js';


export function deleteScene(scene, updateList, physics){

    // Percorre todos os filhos da cena
    while (scene.children.length > 0) {
        console.log(scene.children)
        const obj = scene.children[0];
        
        // Remover o objeto da cena
        scene.remove(obj);

        physics.remove(obj.colliderComponent);

        // Confere se o objto tem uma geometria e libera ela
        if (obj.geometry) {
            obj.geometry.dispose();
        }

        // Confere se o objto tem uma materal e libera ela
        if (obj.material) {
            // Limpa toda a estrutura
            if (Array.isArray(obj.material)) {
                obj.material.forEach(material => material.dispose());
            } else {
                obj.material.dispose();
            }
        }
    }

    // remove da lista de update
    updateList.forEach(element => {
        removeFromScene(element)
    });

}
export default deleteScene;
