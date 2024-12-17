import { WebGLRenderer } from "three/src/Three.js";

export function createRenderer() {
    const renderer = new WebGLRenderer({
        antialias: true,
        // canvas: canvas,
        alpha: true
    });
    return renderer;
}
