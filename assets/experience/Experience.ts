import {
    MathUtils,
    PerspectiveCamera,
    Scene,
    WebGLRenderer
} from "three";

import { createCamera } from "./camera";
import Control from "./Control";
import Globe from "./Globe";
import { createRenderer } from "./renderer";
import { createScene } from "./scene";

export default class Experience {
    private camera: PerspectiveCamera;
    private scene: Scene;
    private renderer: WebGLRenderer;
    private globe: Globe;
    private control: Control;

    constructor(container: HTMLElement) {
        this.camera = createCamera();
        this.renderer = createRenderer();
        this.scene = createScene();
        this.globe = new Globe();
        this.control = new Control(this.globe.getMesh());

        this.scene.add(this.globe.getMesh());
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);

        this.camera.aspect = container.clientWidth / container.clientHeight;
        this.camera.updateProjectionMatrix();

        container.append(this.renderer.domElement);

    }

    start() {
        const minZoomDistance = 15;
        const maxZoomDistance = 25;

        window.addEventListener("wheel", (event) => {
            this.camera.position.z += event.deltaY * 0.01;
            this.camera.position.z = MathUtils.clamp(
                this.camera.position.z,
                minZoomDistance,
                maxZoomDistance
            );
        });

        window.addEventListener("mouseup", () => this.control.stopDragging());
        window.addEventListener("mousedown", (e: MouseEvent) => this.control.startDragging(e.clientX, e.clientY));
        window.addEventListener("mousemove", (e: MouseEvent) => this.control.handleMouseMove(e.clientX, e.clientY));

        this.renderer.setAnimationLoop(() => {
            this.update();
        });
    }

    update() {
        this.control.update();
        this.renderer.render(this.scene, this.camera);
    }
}
