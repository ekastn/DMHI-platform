import { PerspectiveCamera, Scene, WebGLRenderer } from "three";

import { createCamera } from "./camera";
import Control from "./Control";
import Globe from "./Globe";
import { createRenderer } from "./renderer";
import { createScene } from "./scene";
import PinManager from "./PinManager";
import Interaction from "./Interaction";

export default class World {
    private camera: PerspectiveCamera;
    private scene: Scene;
    private renderer: WebGLRenderer;

    private control: Control;
    private globe: Globe;
    private pinManager: PinManager;
    private interaction: Interaction;

    constructor(private container: HTMLDivElement) {
        this.camera = createCamera();
        this.renderer = createRenderer();
        this.scene = createScene();

        this.globe = new Globe(this.scene);
        this.pinManager = new PinManager(this.globe, this.scene);
        this.pinManager.init();
        this.control = new Control(this.camera, this.renderer.domElement);
        this.interaction = new Interaction(
            this.container,
            this.camera,
            this.scene,
            this.renderer,
            this.globe,
            this.pinManager
        );

        this.container.appendChild(this.renderer.domElement);
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);

        this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera.updateProjectionMatrix();
    }

    start() {
        this.renderer.setAnimationLoop(() => {
            this.update();
        });
    }

    update() {
        this.control.update();
        this.interaction.update();
        this.renderer.render(this.scene, this.camera);
    }
}
