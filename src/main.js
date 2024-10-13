// main.js
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Pane } from 'tweakpane';
import { loadEnvironment } from './environment.js';
import { loadPanel } from './panel.js';

const { scene, camera, renderer, cube, directionalLight, directionalLightHelper, updateCameraPosition } = loadEnvironment();
loadPanel(scene, cube, directionalLight, directionalLightHelper);

// Set camera position to look down at the plane
camera.position.set(0, 5, 10);
camera.lookAt(0, 0, 0);
console.log('Camera position set to:', camera.position);


// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    console.log('Window resized:', window.innerWidth, window.innerHeight);
});

//################### End of camera ###############



let pitch = 0;
document.addEventListener('mousemove', (event) => {
    if (event.buttons === 1) { // Left mouse button held down
        camera.rotation.y -= event.movementX * 0.002;
        pitch -= event.movementY * 0.002;
        pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, pitch)); // Limit the pitch to avoid over-rotation
        camera.rotation.x = pitch;
    }
});

// Add raycaster for mouse interaction
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Add event listener for mouse click
window.addEventListener('click', (event) => {
    // Calculate mouse position in normalized device coordinates (-1 to +1)
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Update the raycaster with the camera and mouse position
    raycaster.setFromCamera(mouse, camera);

    // Calculate objects intersected by the ray
    const intersects = raycaster.intersectObjects([cube]);

    if (intersects.length > 0) {
        console.log('Cube clicked!');
        // Create a new cube that will pop up when the original cube is clicked
        const newCubeGeometry = new THREE.BoxGeometry();
        const newCubeMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 }); // Red cube
        const newCube = new THREE.Mesh(newCubeGeometry, newCubeMaterial);
        newCube.position.set(cube.position.x + 2, cube.position.y, cube.position.z); // Position next to the original cube
        scene.add(newCube);
        console.log('New cube added to scene:', newCube);
    }
});

//###################################################



function animate() {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    updateCameraPosition();


    directionalLight.target.position.copy(cube.position);
    directionalLight.target.updateMatrixWorld();
    directionalLightHelper.update();


    renderer.render(scene, camera);
    //console.log('Animating frame');
}

animate();