import {removeFromScene } from './SceneGlobals.js';


export function deleteScene(scene){

    // Percorre todos os filhos da cena
    while (scene.children.length > 0) {
        const obj = scene.children[0];
        
        // Remover o objeto da cena
        scene.remove(obj);

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

    scene.updateList = [];
    scene.tankList = [];
    scene.cameraList = [];
    scene.physics.colliders = [];
    scene.physics.map = [];
    scene.bots = [];

    Object.keys(scene.sounds).forEach(key => scene.sounds[key].setSoundOff())

}
export default deleteScene;
