import {
    PerspectiveCamera,
    Raycaster,
    Scene,
    Vector2,
    WebGLRenderer
} from "three";

import { createCamera } from "./camera";
import Control from "./Control";
import Globe from "./Globe";
import { createRenderer } from "./renderer";
import { createScene } from "./scene";

export default class World {
    private camera: PerspectiveCamera;
    private scene: Scene;
    private renderer: WebGLRenderer;
    private globe: Globe;
    private control: Control;

    constructor(private canvas: HTMLCanvasElement) {
        this.camera = createCamera();
        this.renderer = createRenderer(this.canvas);
        this.scene = createScene();
        this.globe = new Globe(this.scene);

        this.control = new Control(this.camera, this.renderer.domElement);

        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);

        this.camera.aspect = this.canvas.clientWidth / this.canvas.clientHeight;
        this.camera.updateProjectionMatrix();
    }

    start() {
        const raycaster = new Raycaster();
        const mouse = new Vector2();

        this.canvas.addEventListener("mousemove", (e: MouseEvent) => {
            mouse.x = (e.clientX / this.canvas.clientWidth) * 2 - 1;
            mouse.y = -(e.clientY / this.canvas.clientHeight) * 2 + 1;
            raycaster.setFromCamera(mouse, this.camera);
            this.globe.handleRaycast(raycaster);
        });

        this.renderer.setAnimationLoop(() => {
            this.update();
        });
    }

    update() {
        this.control.update();
        this.renderer.render(this.scene, this.camera);
    }
}
