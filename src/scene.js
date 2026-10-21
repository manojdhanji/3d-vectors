import * as THREE from 'three';

const container = document.getElementById('scene');

export const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

export const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);

export const camera = new THREE.PerspectiveCamera(
    60,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
);
camera.position.set(5, 5, 10);
camera.lookAt(0, 0, 0);

// Save initial camera state
export const INITIAL_CAMERA_POS = camera.position.clone();
export const INITIAL_CAMERA_TARGET = new THREE.Vector3(0, 0, 0);

scene.add(new THREE.AxesHelper(2));
scene.add(new THREE.GridHelper(20, 20));

function addAxisLabel(text, position) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.font = '28px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText(text, 0, 28);

    const texture = new THREE.CanvasTexture(canvas);
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture }));
    sprite.scale.set(1.2, 1.2, 1.2);
    sprite.position.copy(position);
    scene.add(sprite);
}

addAxisLabel('X', new THREE.Vector3(3, 0, 0));
addAxisLabel('Y', new THREE.Vector3(0, 3, 0));
addAxisLabel('Z', new THREE.Vector3(0, 0, 3));


function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();
