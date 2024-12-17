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

    constructor(private container: HTMLDivElement) {
        this.camera = createCamera();
        this.renderer = createRenderer();
        this.scene = createScene();
        this.globe = new Globe(this.scene);

        this.control = new Control(this.camera, this.renderer.domElement);

        container.appendChild(this.renderer.domElement)
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);

        this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera.updateProjectionMatrix();
    }

    start() {
        const raycaster = new Raycaster();
        const mouse = new Vector2();

        this.container.addEventListener("mousemove", (e: MouseEvent) => {
            mouse.x = (e.clientX / this.container.clientWidth) * 2 - 1;
            mouse.y = -(e.clientY / this.container.clientHeight) * 2 + 1;
            raycaster.setFromCamera(mouse, this.camera);
            this.globe.handleRaycast(raycaster);
        });

        window.addEventListener("resize", () => {
            this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
            this.camera.updateProjectionMatrix();

            this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
            this.renderer.setPixelRatio(window.devicePixelRatio);
            this.renderer.render(this.scene, this.camera);
        })

        this.renderer.setAnimationLoop(() => {
            this.update();
        });
    }

    update() {
        this.control.update();
        this.globe.update();
        this.renderer.render(this.scene, this.camera);
    }
}
