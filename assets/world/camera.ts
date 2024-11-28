import { PerspectiveCamera } from "three/src/Three.js";

export function createCamera() {
    const fov = 75;
    const aspect = 1;
    const near = 0.1;
    const far = 100;

    const camera = new PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 0, 25);
    return camera;
}
