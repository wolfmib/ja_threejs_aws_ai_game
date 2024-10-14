// environment.js
import * as THREE from 'three';

export function loadEnvironment(width,hight) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / hight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, hight);
    document.body.appendChild(renderer.domElement);

    // Add ambient light to the scene to improve visibility
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4); // Soft white light
    scene.add(ambientLight);
    console.log('Ambient light added:', ambientLight);

    // Add the skybox in the background scene
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
    grassTexture.repeat.set(10, 10);

    // Create a 100x100 plane to represent the grass
    const grassGeometry = new THREE.PlaneGeometry(100, 100);
    const grassMaterial = new THREE.MeshStandardMaterial({ map: grassTexture, metalness: 0.5, roughness: 0.4 });
    const grass = new THREE.Mesh(grassGeometry, grassMaterial);
    grass.rotation.x = -Math.PI / 2;
    grass.position.y = 0;
    scene.add(grass);
    console.log('Grass plane added to scene:', grass);

    // Create a cube
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshStandardMaterial(); // Golden metallic material
    material.color = new THREE.Color("green");
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(0, 2, 0);
    scene.add(cube);
    console.log('Cube added to scene:', cube);

    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(20, 20, 10);
    scene.add(directionalLight);
    const cubeTarget = new THREE.Object3D();
    cubeTarget.position.set(0, 2, 0);
    scene.add(cubeTarget);
    directionalLight.target = cubeTarget;
    directionalLight.target.updateMatrixWorld();

    let directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
    scene.add(directionalLightHelper);
    console.log('Directional light helper added to scene:', directionalLightHelper);

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

    return { scene, camera, renderer, cube, directionalLight, directionalLightHelper, updateCameraPosition };
}