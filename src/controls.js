import { camera, renderer } from './scene.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { drawVector, addVector, clearVectors, computeResultant, constructResultant } from './vector.js';

export function initControls() {

    // 1. OrbitControls setup (must be first)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0);
    controls.update();

    // 2. UI wiring
    const iInput = document.getElementById('input-i');
    const jInput = document.getElementById('input-j');
    const kInput = document.getElementById('input-k');

    document.getElementById('draw-vector').onclick = () => {
        const i = Number(iInput.value);
        const j = Number(jInput.value);
        const k = Number(kInput.value);

        addVector(i, j, k);
        drawVector(i, j, k);
    };

    document.getElementById('clear-vectors').onclick = () => {
        clearVectors();
        iInput.value = 0;
        jInput.value = 0;
        kInput.value = 0;
    };

    document.getElementById('compute-resultant').onclick = () => {
        computeResultant();
    };

    document.getElementById('construct-resultant').onclick = () => {
        constructResultant();
    };

    // Details section toggle
    const detailsToggle = document.getElementById('details-toggle');
    const detailsContent = document.getElementById('details-content');
    const arrow = detailsToggle.querySelector('.arrow');

    detailsToggle.onclick = () => {
        const isOpen = detailsContent.classList.toggle('open');
        arrow.style.transform = isOpen ? 'rotate(90deg)' : 'rotate(0deg)';
    };
}
