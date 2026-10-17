# 3D Vector Visualizer

A browser-based 3D vector visualizer built with Three.js and Vite. Add vectors by their `i`, `j`, and `k` components, inspect them in a rotatable 3D coordinate system, and calculate or construct their resultant.

## Features

- Draw multiple vectors in a 3D coordinate system.
- Compute the resultant vector, its magnitude, and its angles with the coordinate axes.
- Display vector addition using a head-to-tail construction.
- Clear the scene and start again.

## Run Locally

Requirements: Node.js and npm.

```sh
npm install
npm run dev
```

Open the URL printed by Vite, typically `http://localhost:5173/3d-vectors/`.

To create and preview a production build:

```sh
npm run build
npm run preview
```

## Run with Docker Compose

```sh
docker compose up --build
```

Open [http://localhost:8088/3d-vectors/](http://localhost:8088/3d-vectors/). Stop the container with `Ctrl+C`; run `docker compose down` to remove it.

## Using the Visualizer

1. Enter the vector's `i`, `j`, and `k` components.
2. Select **Draw** to add it to the scene. Repeat to add more vectors.
3. Select **Resultant** to see the sum, magnitude, and axis angles, or **Head-2-Tail Construction** to show the vectors translated head-to-tail.
4. Select **Clear** to remove the vectors and reset the inputs.

Drag in the 3D scene to orbit the view.

## Project Commands

- `npm run dev` starts the Vite development server.
- `npm run build` creates the production files in `dist/`.
- `npm run preview` serves the production build locally.