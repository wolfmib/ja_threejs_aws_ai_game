import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Pane } from 'tweakpane';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add ambient light to the scene to improve visibility
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4); // Soft white light
scene.add(ambientLight);
console.log('Ambient light added:', ambientLight);

// Add the src/textures/skybox in the background scene
const loader = new THREE.CubeTextureLoader();
const skyboxTexture = loader.load([
    'src/textures/skybox/px.png', // Positive X
    'src/textures/skybox/nx.png', // Negative X
    'src/textures/skybox/py.png', // Positive Y
    'src/textures/skybox/ny.png', // Negative Y
    'src/textures/skybox/pz.png', // Positive Z
    'src/textures/skybox/nz.png'  // Negative Z
]);
scene.background = skyboxTexture;

// Create a sphere to represent the sun
const sunGeometry = new THREE.SphereGeometry(2, 32, 32);
const sunTexture = new THREE.TextureLoader().load('http://15.237.164.208:8888/src/textures/sun_texture.png'); // Suggested texture
const sunMaterial = new THREE.MeshStandardMaterial({ map: sunTexture, emissive: 0xffd700, metalness: 1, roughness: 0.5});
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
sun.position.set(10, 10, 10);
scene.add(sun);
console.log('Sun added to scene:', sun);

// Add a point light to simulate the sun's light
const sunLight = new THREE.PointLight(0xffffff, 3);
sunLight.position.set(-10, 10, -10);
scene.add(sunLight);
console.log('Point light added to scene:', sunLight);

const sunLight2 = new THREE.PointLight(0xffffff, 3);
sunLight2.position.set(10, 10, -10);
scene.add(sunLight2);
console.log('Point light added to scene:', sunLight2);

// Add a point light helper to visualize the light position and range
const pointLightHelper = new THREE.PointLightHelper(sunLight, 5); // Adjust size to see the helper better
const pointLightHelper2 = new THREE.PointLightHelper(sunLight2, 5); // Adjust size to see the helper better

scene.add(pointLightHelper, pointLightHelper2);

// Add a directional light to enhance scene lighting
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
directionalLight.position.set(20, 20, 10);
scene.add(directionalLight);

// Set the directional light target to the cube
const cubeTarget = new THREE.Object3D();
cubeTarget.position.set(0, 2, 0); // Same position as the cube
scene.add(cubeTarget);
directionalLight.target = cubeTarget;
directionalLight.target.updateMatrixWorld();

let directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
scene.add(directionalLightHelper);
console.log('Directional light helper added to scene:', directionalLightHelper);

// Load the grass texture
const textureLoader = new THREE.TextureLoader();
const grassTexture = textureLoader.load(
    'http://15.237.164.208:8888/src/textures/grass.png',
    () => console.log('Grass texture loaded successfully'),
    undefined,
    (err) => console.error('Error loading grass texture:', err)
);

// Set texture properties to repeat more frequently to make the grass appear smaller
grassTexture.wrapS = THREE.RepeatWrapping;
grassTexture.wrapT = THREE.RepeatWrapping;
grassTexture.repeat.set(10, 10); // Increase the repeat count to make the grass texture appear smaller

// Create a 100x100 plane to represent the grass
const grassGeometry = new THREE.PlaneGeometry(100, 100);
const grassMaterial = new THREE.MeshStandardMaterial({ map: grassTexture, metalness: 0.5, roughness: 0.4 });
const grass = new THREE.Mesh(grassGeometry, grassMaterial);

grass.rotation.x = -Math.PI / 2; // Rotate the plane to make it horizontal
grass.position.y = 0; // Set y position to 0
scene.add(grass);
console.log('Grass plane added to scene:', grass);

// Create a cube
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshStandardMaterial(); // Golden metallic material
material.color = new THREE.Color("green");

// Add Tweakpane for tweaking material and light properties
const pane = new Pane();
// Adding a folder to group controls for material properties
const materialFolder = pane.addFolder({ title: 'Material Properties' });

materialFolder.addInput(material, 'metalness', {
    min: 0,
    max: 1,
    step: 0.01
});

materialFolder.addInput(material, 'roughness', {
    min: 0,
    max: 1,
    step: 0.01
});

// Adding ambient light controls
const ambientLightFolder = pane.addFolder({ title: 'Ambient Light' });
ambientLightFolder.addInput(ambientLight, 'intensity', {
    min: 0,
    max: 1,
    step: 0.01
});

// Adding point lights controls
const sunLightFolder = pane.addFolder({ title: 'Sun Light 1' });
sunLightFolder.addInput(sunLight, 'intensity', {
    min: 0,
    max: 10,
    step: 0.1
});
sunLightFolder.addInput(sunLight.position, 'x', {
    min: -50,
    max: 50,
    step: 1
});
sunLightFolder.addInput(sunLight.position, 'y', {
    min: -50,
    max: 50,
    step: 1
});
sunLightFolder.addInput(sunLight.position, 'z', {
    min: -50,
    max: 50,
    step: 1
});

const sunLight2Folder = pane.addFolder({ title: 'Sun Light 2' });
sunLight2Folder.addInput(sunLight2, 'intensity', {
    min: 0,
    max: 10,
    step: 0.1
});
sunLight2Folder.addInput(sunLight2.position, 'x', {
    min: -50,
    max: 50,
    step: 1
});
sunLight2Folder.addInput(sunLight2.position, 'y', {
    min: -50,
    max: 50,
    step: 1
});
sunLight2Folder.addInput(sunLight2.position, 'z', {
    min: -50,
    max: 50,
    step: 1
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

const cube = new THREE.Mesh(geometry, material);
cube.position.set(0, 2, 0); // Lift the cube a bit to make it above the plane
scene.add(cube);
console.log('Cube added to scene:', cube);

// Set camera position to look down at the plane
camera.position.set(0, 5, 10);
camera.lookAt(0, 0, 0);
console.log('Camera position set to:', camera.position);

// Implement custom controls for WASD and mouse movement
let keys = {};
document.addEventListener('keydown', (event) => {
    keys[event.key.toLowerCase()] = true;
});
document.addEventListener('keyup', (event) => {
    keys[event.key.toLowerCase()] = false;
});

let velocity = 0.2;
function updateCameraPosition() {
    if (keys['w']) {
        camera.position.x -= Math.sin(camera.rotation.y) * velocity;
        camera.position.z -= Math.cos(camera.rotation.y) * velocity;
    }
    if (keys['s']) {
        camera.position.x += Math.sin(camera.rotation.y) * velocity;
        camera.position.z += Math.cos(camera.rotation.y) * velocity;
    }
    if (keys['a']) {
        camera.position.x -= Math.cos(camera.rotation.y) * velocity;
        camera.position.z += Math.sin(camera.rotation.y) * velocity;
    }
    if (keys['d']) {
        camera.position.x += Math.cos(camera.rotation.y) * velocity;
        camera.position.z -= Math.sin(camera.rotation.y) * velocity;
    }
}

let pitch = 0;
document.addEventListener('mousemove', (event) => {
    if (event.buttons === 1) { // Left mouse button held down
        camera.rotation.y -= event.movementX * 0.002;
        pitch -= event.movementY * 0.002;
        pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, pitch)); // Limit the pitch to avoid over-rotation
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

// Add an x-y-z axis helper to the scene
const axesHelper = new THREE.AxesHelper(10);
scene.add(axesHelper);
console.log('AxesHelper added to scene');

animate();