import { scene } from './scene.js';
import * as THREE from 'three';

let vectors = [];
let resultantArrow = null;
let angleArcs = [];   // store arcs so we can remove them later
const constructionLines = [];

function drawThickArrow(start, end, color = 0xffffff) {
    const vec = end.clone().sub(start);
    const length = vec.length();
    const dir = vec.clone().normalize();

    const shaftRadius = 0.05;      // thickness of the arrow shaft
    const headRadius = 0.12;      // thickness of the arrowhead
    const headLength = 0.25;      // length of the arrowhead

    // Shaft
    const shaftGeom = new THREE.CylinderGeometry(shaftRadius, shaftRadius, length - headLength, 12);
    const shaftMat = new THREE.MeshBasicMaterial({ color });
    const shaft = new THREE.Mesh(shaftGeom, shaftMat);

    // Arrowhead
    const headGeom = new THREE.ConeGeometry(headRadius, headLength, 12);
    const headMat = new THREE.MeshBasicMaterial({ color });
    const head = new THREE.Mesh(headGeom, headMat);

    // Positioning
    shaft.position.copy(start).addScaledVector(dir, (length - headLength) / 2);
    head.position.copy(start).addScaledVector(dir, length - headLength / 2);

    // Orientation
    const axis = new THREE.Vector3(0, 1, 0);
    const quaternion = new THREE.Quaternion().setFromUnitVectors(axis, dir);
    shaft.quaternion.copy(quaternion);
    head.quaternion.copy(quaternion);

    scene.add(shaft);
    scene.add(head);

    constructionLines.push(shaft, head);

    return { shaft, head };
}


function clearConstructionLines() {
    for (const obj of constructionLines) {
        scene.remove(obj);
    }
    constructionLines.length = 0;
}

function drawTranslatedArrow(start, vec) {
    const dir = vec.clone().normalize();
    const length = vec.length();
    const color = vectorColor(vec.x, vec.y, vec.z);

    const arrow = new THREE.ArrowHelper(dir, start, length, color);
    scene.add(arrow);
    constructionLines.push(arrow);
}

export function constructResultant() {
    if (vectors.length === 0) return;

    clearConstructionLines();

    let currentHead = new THREE.Vector3(0, 0, 0);

    for (const v of vectors) {
        const vec = new THREE.Vector3(v.i, v.j, v.k);

        // Draw translated arrow with correct color + arrowhead
        drawTranslatedArrow(currentHead, vec);

        // Move head forward
        currentHead.add(vec);
    }
    // Now compute + draw resultant + arcs + UI
    computeResultant();
}

function drawAngleArc(resultant, axis, color) {
    const radius = 1.5;
    const segments = 40;

    const axisDir = axis.clone().normalize();
    const resDir = resultant.clone().normalize();

    const points = [];

    for (let i = 0; i <= segments; i++) {
        const t = i / segments;

        // Slerp-like interpolation between axisDir and resDir
        const dir = new THREE.Vector3().lerpVectors(axisDir, resDir, t).normalize();
        const point = dir.clone().multiplyScalar(radius);
        points.push(point);
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color });
    const arc = new THREE.Line(geometry, material);

    scene.add(arc);
    angleArcs.push(arc);
}

function vectorColor(i, j, k) {
    const max = Math.max(Math.abs(i), Math.abs(j), Math.abs(k), 1);
    return new THREE.Color(
        Math.abs(i) / max,
        Math.abs(j) / max,
        Math.abs(k) / max
    );
}

export function addVector(i, j, k) {
    vectors.push({ i, j, k });
}

export function drawVector(i, j, k) {
    const origin = new THREE.Vector3(0, 0, 0);
    const dir = new THREE.Vector3(i, j, k).normalize();
    const length = Math.hypot(i, j, k);
    const color = vectorColor(i, j, k);

    const arrow = new THREE.ArrowHelper(dir, origin, length, color);
    scene.add(arrow);
}

export function clearVectors() {
    vectors = [];

    // Remove all arrows
    scene.children = scene.children.filter(obj =>
        !(obj instanceof THREE.ArrowHelper)
    );

    // Remove resultant arrow reference
    if (resultantArrow) {
        scene.remove(resultantArrow.shaft);
        scene.remove(resultantArrow.head);
        resultantArrow = null;
    }


    // Remove arcs
    angleArcs.forEach(arc => scene.remove(arc));
    angleArcs = [];

    clearConstructionLines();

    // Clear UI
    document.getElementById('res-components').textContent = '-';
    document.getElementById('res-magnitude').textContent = '-';
    document.getElementById('res-angle-x').textContent = '-';
    document.getElementById('res-angle-y').textContent = '-';
    document.getElementById('res-angle-z').textContent = '-';
    document.getElementById('result-details').classList.add('hidden');
}

export function computeResultant() {
    console.log('Computing resultant vector...');

    // Remove previous resultant arrow
    if (resultantArrow) {
        scene.remove(resultantArrow);
        resultantArrow = null;
    }

    // Remove previous arcs
    angleArcs.forEach(arc => scene.remove(arc));
    angleArcs = [];

    // Compute resultant
    const res = vectors.reduce(
        (acc, v) => acc.add(new THREE.Vector3(v.i, v.j, v.k)),
        new THREE.Vector3(0, 0, 0)
    );

    const magnitude = res.length();
    const unit = res.clone().normalize();

    // Compute angles with axes
    const angleX = THREE.MathUtils.radToDeg(Math.acos(unit.x));
    const angleY = THREE.MathUtils.radToDeg(Math.acos(unit.y));
    const angleZ = THREE.MathUtils.radToDeg(Math.acos(unit.z));

    // Update UI
    document.getElementById('res-components').textContent =
        `(${res.x.toFixed(2)}, ${res.y.toFixed(2)}, ${res.z.toFixed(2)})`;

    document.getElementById('res-magnitude').textContent =
        magnitude.toFixed(2);

    document.getElementById('res-angle-x').textContent = angleX.toFixed(2);
    document.getElementById('res-angle-y').textContent = angleY.toFixed(2);
    document.getElementById('res-angle-z').textContent = angleZ.toFixed(2);

    // Draw resultant arrow (white)
    const origin = new THREE.Vector3(0, 0, 0);
    const end = origin.clone().add(res);
    resultantArrow = drawThickArrow(origin, end, 0xffffff);;   // store both parts

    scene.add(resultantArrow);

    // Draw arcs for angles

    drawAngleArc(res, new THREE.Vector3(1, 0, 0), 0xff0000); // X
    drawAngleArc(res, new THREE.Vector3(0, 1, 0), 0x00ff00); // Y
    drawAngleArc(res, new THREE.Vector3(0, 0, 1), 0x0000ff); // Z

    document.getElementById('result-details').classList.remove('hidden');
}
