import {
    DoubleSide,
    Mesh,
    MeshBasicMaterial,
    PerspectiveCamera,
    Raycaster,
    RingGeometry,
    Scene,
    SphereGeometry,
    Vector2,
    Vector3,
    WebGLRenderer,
} from "three";

import { createCamera } from "./camera";
import Control from "./Control";
import Globe from "./Globe";
import { createRenderer } from "./renderer";
import { createScene } from "./scene";
import ControlState from "../context/ControlState";
import { useNavigate } from "@solidjs/router";

const { controlState, setLocation, toggleControl } = ControlState;

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

        container.appendChild(this.renderer.domElement);
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);

        this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera.updateProjectionMatrix();
    }

    start() {
        const sphereGeo = new SphereGeometry(this.globe.radius, 64, 64);
        const sphereMat = new MeshBasicMaterial({ color: 0xefc88b });
        const sphere = new Mesh(sphereGeo, sphereMat);
        this.scene.add(sphere);

        const markerGeometry = new SphereGeometry(0.09, 32, 32);
        const markerMaterial = new MeshBasicMaterial({ color: 0xff0000 });
        const marker = new Mesh(markerGeometry, markerMaterial);
        marker.visible = false;
        this.scene.add(marker);

        let markerTargetPosition = new Vector3();
        let normalIntersactionPoint = new Vector3();

        const ringGeometry = new RingGeometry(0.06, 0.3, 32);
        const ringMaterial = new MeshBasicMaterial({
            color: 0x210232,
            side: DoubleSide,
            transparent: true,
            opacity: 0.5,
        });
        const highlightRing = new Mesh(ringGeometry, ringMaterial);
        highlightRing.visible = false;
        this.scene.add(highlightRing);

        const raycaster = new Raycaster();
        const mouse = new Vector2();

        let longitude = 0;
        let latitude = 0;
        this.container.addEventListener("mousemove", (e: MouseEvent) => {
            mouse.x = (e.clientX / this.container.clientWidth) * 2 - 1;
            mouse.y = -(e.clientY / this.container.clientHeight) * 2 + 1;
            raycaster.setFromCamera(mouse, this.camera);

            this.globe.handleRaycast(raycaster);

            const intersectsGlobe = raycaster.intersectObject(sphere);
            if (intersectsGlobe.length > 0 && controlState()) {
                marker.visible = false;
                const intersectionPoint = intersectsGlobe[0].point;

                normalIntersactionPoint = intersectionPoint.clone().normalize();

                markerTargetPosition.copy(intersectionPoint);
                highlightRing.lookAt(intersectionPoint.clone().add(normalIntersactionPoint));

                marker.visible = true;
                highlightRing.visible = true;

                const phi = Math.acos(intersectionPoint.y / this.globe.radius);
                const theta = Math.atan2(intersectionPoint.z, intersectionPoint.x);
                latitude = 90 - (phi * 180) / Math.PI;
                longitude = ((theta * 180) / Math.PI + 360) % 360;
            } else {
                highlightRing.visible = false;
                marker.visible = false;
            }
        });

        window.addEventListener("resize", () => {
            this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
            this.camera.updateProjectionMatrix();

            this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
            this.renderer.setPixelRatio(window.devicePixelRatio);
            this.renderer.render(this.scene, this.camera);
        });

        this.container.addEventListener("keydown", (e) => {
            if (e.code === "Space") {
                e.preventDefault();
                toggleControl();
            }
        });

        const navigate = useNavigate();

        this.container.addEventListener("click", () => {
            console.log("click");
            if (controlState()) {
                const state = { latitude, longitude };
                setLocation(state);
                toggleControl();
                navigate("/create-story", { state });
            }
        });

        this.renderer.setAnimationLoop(() => {
            if (marker.visible) {
                marker.position.lerp(markerTargetPosition, 0.3);
                highlightRing.position.lerp(markerTargetPosition, 0.3);

                const scale = 1 + Math.sin(Date.now() * 0.005) * 0.2;
                marker.scale.set(scale, scale, scale);
            }
            this.update();
        });
    }

    update() {
        this.control.update();
        this.globe.update();
        this.renderer.render(this.scene, this.camera);
    }
}
