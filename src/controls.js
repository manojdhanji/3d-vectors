import { camera, renderer, INITIAL_CAMERA_POS, INITIAL_CAMERA_TARGET } from './scene.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { drawVector, addVector, clearVectors, computeResultant, constructResultant } from './vector.js';
import { randomComponent, getRandomCount } from './utils.js';

export function initControls() {

    // 1. OrbitControls setup (must be first)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.copy(INITIAL_CAMERA_TARGET);
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

    const vectorListToggle = document.getElementById('vector-list-toggle');
    const vectorListContent = document.getElementById('vector-list');
    const vectorArrow = vectorListToggle.querySelector('.arrow');

    vectorListToggle.onclick = () => {
        const isOpen = vectorListContent.classList.toggle('open');
        vectorArrow.style.transform = isOpen ? 'rotate(90deg)' : 'rotate(0deg)';
    };

    document.getElementById('random-vectors').onclick = () => {
        const count = getRandomCount(15, 20); // random number between 15 and 20

        for (let n = 0; n < count; n++) {
            const i = randomComponent(-10, 10);
            const j = randomComponent(-10, 10);
            const k = randomComponent(-10, 10);

            addVector(i, j, k);
            drawVector(i, j, k);
        }
    };

    document.getElementById('reset-all').onclick = () => {
        clearVectors();
        iInput.value = 0;
        jInput.value = 0;
        kInput.value = 0;
        resetView(controls);
    };
}

function resetView(controls) {
    // Reset camera position
    camera.position.copy(INITIAL_CAMERA_POS);

    // Reset camera orientation
    camera.lookAt(INITIAL_CAMERA_TARGET);

    // Reset OrbitControls target
    controls.target.copy(INITIAL_CAMERA_TARGET);

    // Reset zoom
    camera.zoom = 1;
    camera.updateProjectionMatrix();

    controls.setPolarAngle(Math.PI / 4);     // 45° tilt
    controls.setAzimuthAngle(Math.PI / 4);   // 45° rotation

    controls.update();
}
