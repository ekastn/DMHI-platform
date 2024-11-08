import {
    IcosahedronGeometry,
    Mesh,
    MeshNormalMaterial,
    PerspectiveCamera,
    Scene,
    WebGLRenderer
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import { createCamera } from "./camera";
import { createRenderer } from "./renderer";
import { createScene } from "./scene";

export default class Experience {
    private camera: PerspectiveCamera;
    private scene: Scene;
    private renderer: WebGLRenderer;
    private control: OrbitControls;

    constructor(container: HTMLElement) {
        this.camera = createCamera();
        this.renderer = createRenderer();
        this.scene = createScene();
        this.control = new OrbitControls(this.camera, this.renderer.domElement);

        this.renderer.setSize(container.clientWidth, container.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);

        this.camera.aspect = container.clientWidth / container.clientHeight;
        this.camera.updateProjectionMatrix();

        container.append(this.renderer.domElement);
    }

    start() {
        const geometry = new IcosahedronGeometry(2, 1);
        const material = new MeshNormalMaterial({ wireframe: true });
        const mesh = new Mesh(geometry, material);

        this.scene.add(mesh);
        this.renderer.render(this.scene, this.camera);

        this.renderer.setAnimationLoop(() => {
            mesh.rotation.x += 0.005;
            mesh.rotation.y += 0.005;
            this.update();
        });
    }

    update() {
        this.control.update();
        this.renderer.render(this.scene, this.camera);
    }
}
