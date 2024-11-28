import { WebGLRenderer } from "three/src/Three.js";

export function createRenderer(canvas: HTMLCanvasElement) {
    const renderer = new WebGLRenderer({ 
        antialias: true, 
        canvas: canvas, 
        alpha: true 
    });
    return renderer;
}
