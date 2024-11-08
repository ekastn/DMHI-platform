import { WebGLRenderer } from "three/src/Three.js";

export function createRenderer() {
    const renderer = new WebGLRenderer({ antialias: true });
    renderer.setClearColor(0xFEF9F2);
    return renderer;
}
