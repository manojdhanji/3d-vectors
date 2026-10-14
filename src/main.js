import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const container = document.getElementById('scene');

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);

// Camera
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(5, 5, 10);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);

// Axes
scene.add(new THREE.AxesHelper(5));

// Grid
scene.add(new THREE.GridHelper(10, 10));

// Draw vector (i, j, k)
export function drawVector(i, j, k, color = 0xffff00) {
  const origin = new THREE.Vector3(0, 0, 0);
  const dir = new THREE.Vector3(i, j, k).normalize();
  const length = Math.hypot(i, j, k);

  const arrow = new THREE.ArrowHelper(dir, origin, length, color);
  scene.add(arrow);
}

// Example vector
drawVector(2, 3, -1);

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

// Resize
window.addEventListener('resize', () => {
  const w = window.innerWidth;
  const h = window.innerHeight;
  renderer.setSize(w, h);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
});
