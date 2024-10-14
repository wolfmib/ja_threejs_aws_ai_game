// panel.js
import { Pane } from 'tweakpane';
import * as THREE from 'three';

export function loadPanel(scene, cube, directionalLight, directionalLightHelper) {
    const panelContainer = document.getElementById('panel-container');
    const pane = new Pane({ container: panelContainer });

    // Adding a folder to group controls for material properties
    const materialFolder = pane.addFolder({ title: 'Material Properties' });
    materialFolder.addInput(cube.material, 'metalness', {
        min: 0,
        max: 1,
        step: 0.01
    });
    materialFolder.addInput(cube.material, 'roughness', {
        min: 0,
        max: 1,
        step: 0.01
    });

    // Adding ambient light controls
    const ambientLight = scene.children.find(child => child instanceof THREE.AmbientLight);
    if (ambientLight) {
        const ambientLightFolder = pane.addFolder({ title: 'Ambient Light' });
        ambientLightFolder.addInput(ambientLight, 'intensity', {
            min: 0,
            max: 1,
            step: 0.01
        });
    }

    // Adding point lights controls
    const pointLights = scene.children.filter(child => child instanceof THREE.PointLight);
    pointLights.forEach((light, index) => {
        const pointLightFolder = pane.addFolder({ title: `Point Light ${index + 1}` });
        pointLightFolder.addInput(light, 'intensity', {
            min: 0,
            max: 10,
            step: 0.1
        });
        pointLightFolder.addInput(light.position, 'x', {
            min: -50,
            max: 50,
            step: 1
        });
        pointLightFolder.addInput(light.position, 'y', {
            min: -50,
            max: 50,
            step: 1
        });
        pointLightFolder.addInput(light.position, 'z', {
            min: -50,
            max: 50,
            step: 1
        });
    });

    // Adding directional light controls
    const directionalLightFolder = pane.addFolder({ title: 'Directional Light' });
    directionalLightFolder.addInput(directionalLight, 'intensity', {
        min: 0,
        max: 10,
        step: 0.1
    });
    directionalLightFolder.addInput(directionalLight.position, 'x', {
        min: -50,
        max: 50,
        step: 1
    });
    directionalLightFolder.addInput(directionalLight.position, 'y', {
        min: -50,
        max: 50,
        step: 1
    });
    directionalLightFolder.addInput(directionalLight.position, 'z', {
        min: -50,
        max: 50,
        step: 1
    });
    directionalLightFolder.addInput(directionalLight, 'color');

    directionalLightFolder.on('change', () => {
        directionalLight.target.position.copy(cube.position);
        directionalLight.target.updateMatrixWorld();
        directionalLightHelper.update();
    });
}
