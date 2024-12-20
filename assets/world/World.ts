import {
    DoubleSide,
    Material,
    Mesh,
    MeshBasicMaterial,
    PerspectiveCamera,
    PointsMaterial,
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
import { catchError } from "../utils/common";
import { getListOfPinsApi } from "../services/pinServices";
import { useWebSocket } from "../context/WebSocketContext";
import { createEffect } from "solid-js";
import { PinType } from "../types/story";
import Pin from "./Pin";
import { latLngToVector3, vector3ToLatLng } from "../utils/math";

const { controlState, setLocation, toggleControl, hoverPin, setHoverPin } = ControlState;

export default class World {
    private camera: PerspectiveCamera;
    private scene: Scene;
    private renderer: WebGLRenderer;
    private globe: Globe;
    private control: Control;

    private pins: Pin[] = [];
    private hoveredStoryId = -1;

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

        const { pin } = useWebSocket();
        createEffect(() => {
            if (pin.storyId !== 0) {
                this.createPin(pin, pin.storyId);
            }
        });
    }

    start() {
        this.plotPins();

        const sphereGeo = new SphereGeometry(this.globe.radius, 64, 64);
        const sphereMat = new MeshBasicMaterial({ color: 0xefc88b });
        const sphere = new Mesh(sphereGeo, sphereMat);
        sphere.visible = false;
        this.scene.add(sphere);

        const markerGeometry = new SphereGeometry(0.09, 32, 32);
        const markerMaterial = new MeshBasicMaterial({ color: 0xff0000 });
        const marker = new Mesh(markerGeometry, markerMaterial);
        marker.visible = false;
        this.scene.add(marker);

        let markerTargetPosition = new Vector3();
        let normalIntersactionPoint = new Vector3();

        const raycaster = new Raycaster();
        const mouse = new Vector2();

        let longitude = 0;
        let latitude = 0;
        this.container.addEventListener("mousemove", (e: MouseEvent) => {
            mouse.x = (e.clientX / this.container.clientWidth) * 2 - 1;
            mouse.y = -(e.clientY / this.container.clientHeight) * 2 + 1;
            raycaster.setFromCamera(mouse, this.camera);

            this.globe.handleRaycast(raycaster);

            if (this.pins.length > 0) {
                this.pins.forEach((pin) => {
                    pin.handleRaycast(raycaster);
                });
            }

            const intersects = raycaster.intersectObjects(this.scene.children);
            if (intersects.length > 0 && intersects[0].object.userData.storyId) {
                this.hoveredStoryId = intersects[0].object.userData.storyId;
                setHoverPin(true);
            }

            const intersectsGlobe = raycaster.intersectObject(sphere);
            if (intersectsGlobe.length > 0 && controlState()) {
                marker.visible = false;
                const intersectionPoint = intersectsGlobe[0].point;

                normalIntersactionPoint = intersectionPoint.clone().normalize();

                markerTargetPosition.copy(intersectionPoint);

                marker.visible = true;

                const coord = vector3ToLatLng(intersectionPoint);
                latitude = coord.lat;
                longitude = coord.lng;
            } else {
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
            if (controlState()) {
                const state = { latitude, longitude };
                setLocation(state);
                toggleControl();
                navigate("/story/create", { state });
            }

            if (hoverPin() && this.hoveredStoryId != -1) {
                navigate(`/story/${this.hoveredStoryId}`);
            }
        });

        this.renderer.setAnimationLoop(() => {
            if (marker.visible) {
                marker.position.lerp(markerTargetPosition, 0.3);

                const scale = 1 + Math.sin(Date.now() * 0.005) * 0.2;
                marker.scale.set(scale, scale, scale);
            }
            this.update();
        });
    }

    update() {
        this.control.update();
        this.renderer.render(this.scene, this.camera);
    }

    private plotPins() {
        this.loadPins().then((pins) => {
            pins?.forEach((pin) => {
                this.createPin(pin, pin.storyId);
            });
        });
    }

    private createPin(pin: PinType, storyId: number) {
        const newPin = new Pin(pin.latitude, pin.longitude, storyId, this.scene, this.globe.radius);
        this.pins.push(newPin);
    }

    private async loadPins() {
        const [error, data] = await catchError(getListOfPinsApi());
        if (error) console.error(error);
        return data?.data.pins;
    }
}
