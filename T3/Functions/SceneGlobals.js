let scene;
let renderer;

export function setRenderer(newRenderer) {
    renderer = newRenderer;
}

export function getRenderer() {
    return renderer;
}

export function setCurrentScene(newScene) {
    scene = newScene;
}

export function removeFromScene(obj){
    scene.remove(obj.geometry);
    obj.geometry = null;
    const index = scene.updateList.indexOf(obj);
    if (index > -1) { 
       scene.updateList.splice(index, 1);
    }
    scene.physics.remove(obj.colliderComponent);
}

export function getCurrentScene() {
    return scene;
}

export function addSound(soundName, sound) {
    if (scene)
        scene.sounds[soundName] = sound;
}

export function getSounds() {
    return scene.sounds
}
