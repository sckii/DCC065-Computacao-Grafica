import * as THREE from 'three';
import MainCamera from "./MainCamera.js";
import { CSS2DRenderer } from "../../build/jsm/Addons.js";
import { initCamera, initRenderer } from "../../libs/util/util.js";
import { OrbitControls } from '../../build/jsm/Addons.js';
import PhysicsEnvironment from '../Physics/PhysicsEnvironment.js';
import { onWindowResize } from '../../libs/util/util.js';

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