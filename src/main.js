// main.js

import * as THREE from 'three';
import { loadEnvironment } from './environment.js';
import { loadPanel } from './panel.js';

const width = (window.innerWidth * 7) / 10;
const height = window.innerHeight;

const { scene, camera, renderer, cube, directionalLight, directionalLightHelper, updateCameraPosition } = loadEnvironment(width, height);
loadPanel(scene, cube, directionalLight, directionalLightHelper);

// Attach the renderer to the left-panel
const leftPanel = document.getElementById('left-panel');
leftPanel.appendChild(renderer.domElement);

camera.position.set(0, 5, 10);
camera.lookAt(0, 0, 0);
console.log('Camera position set to:', camera.position);

// Raycaster for detecting clicks on objects
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onMouseClick(event) {
    mouse.x = (event.clientX / width) * 2 - 1;
    mouse.y = -((event.clientY / height) * 2 - 1);

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects([cube]);

    if (intersects.length > 0) {
        console.log('Cube clicked!');
        triggerBotResponse("What's up?");
    }
}

window.addEventListener('click', onMouseClick);

// Function to trigger bot response
export function triggerBotResponse(message) {
    const chatHistory = document.getElementById('chat-history');
    if (chatHistory) {
        const botResponse = document.createElement('p');
        botResponse.innerHTML = `<strong>Bot:</strong> ${message}`;
        chatHistory.appendChild(botResponse);

        chatHistory.scrollTop = chatHistory.scrollHeight; // Scroll down to latest message
    }
}

let pitch = 0;
document.addEventListener('mousemove', (event) => {
    if (event.buttons === 1) {
        camera.rotation.y -= event.movementX * 0.002;
        pitch -= event.movementY * 0.002;
        pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, pitch));
        camera.rotation.x = pitch;
    }
});

function animate() {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    updateCameraPosition();

    directionalLight.target.position.copy(cube.position);
    directionalLight.target.updateMatrixWorld();
    directionalLightHelper.update();

    renderer.render(scene, camera);
    console.log('Animating frame');
}

animate();
