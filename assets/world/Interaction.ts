import { Navigator, useNavigate } from "@solidjs/router";
import {
    Mesh,
    MeshBasicMaterial,
    PerspectiveCamera,
    Raycaster,
    Scene,
    SphereGeometry,
    Texture,
    Vector2,
    WebGLRenderer,
    Vector3,
} from "three";
import { vector3ToLatLng } from "../utils/math";
import Globe from "./Globe";
import ControlState from "../context/ControlState";
import PinManager from "./PinManager";

const { hoverPin, setHoverPin, setLocation, controlState, toggleControl } = ControlState;

export default class Interaction {
    private raycaster = new Raycaster();
    private mouse = new Vector2();

    private marker: Mesh;
    private markerTargetPosition = new Vector3();

    private hoveredStoryId: number = -1;
    private longitude: number = 0;
    private latitude: number = 0;

    private navigate: Navigator;
    private locationContainer: HTMLElement;

    constructor(
        private container: HTMLElement,
        private camera: PerspectiveCamera,
        private scene: Scene,
        private renderer: WebGLRenderer,
        private globe: Globe,
        private pinManager: PinManager
    ) {
        this.marker = new Mesh(
            new SphereGeometry(0.09, 32, 32),
            new MeshBasicMaterial({ color: 0xff0000 })
        );
        this.marker.visible = false;
        this.scene.add(this.marker);

        this.navigate = useNavigate();
        this.locationContainer = document.getElementById("location-indicator")!;
        this.initEventListeners();
    }

    public update() {
        if (this.marker.visible) {
            this.marker.position.lerp(this.markerTargetPosition, 0.3);

            const scale = 1 + Math.sin(Date.now() * 0.005) * 0.2;
            this.marker.scale.set(scale, scale, scale);
        }
    }

    private initEventListeners() {
        this.container.addEventListener("mousemove", this.onMouseMove.bind(this));
        this.container.addEventListener("click", this.onClick.bind(this));
        window.addEventListener("resize", this.onResize.bind(this));
    }

    private onMouseMove(e: MouseEvent) {
        this.mouse.x = (e.clientX / this.container.clientWidth) * 2 - 1;
        this.mouse.y = -(e.clientY / this.container.clientHeight) * 2 + 1;
        this.raycaster.setFromCamera(this.mouse, this.camera);

        this.hoveredStoryId = -1;

        this.handleGlobeRaycast();
        this.handlePinRaycast();
    }

    private handleGlobeRaycast() {
        const intersects = this.raycaster.intersectObject(this.globe.sphere);

        if (intersects.length > 0) {
            if (controlState()) {
                this.marker.visible = false;
                const intersectionPoint = intersects[0].point;

                this.markerTargetPosition.copy(intersectionPoint);

                this.marker.visible = true;

                const coord = vector3ToLatLng(intersectionPoint);
                this.latitude = coord.lat;
                this.longitude = coord.lng;
            } else {
                this.marker.visible = false;
            }

            const uv = intersects[0].uv;

            if (uv && this.globe.getCountryDataTexture()) {
                const pixelData = this.sampleTexture(this.globe.getCountryDataTexture()!, uv);
                const countryId = this.globe.getCountryIdFromColor(pixelData!);

                if (countryId !== this.globe.getHoverCountryId()) {
                    this.globe.setHoverCountryId(countryId);
                    this.globe.updateHoverCountry(countryId);
                }
            }
        } else {
            if (this.globe.getHoverCountryId() !== -1) {
                this.globe.setHoverCountryId(-1);
                this.globe.updateHoverCountry(-1);
            }
        }

        const intersectCountries = this.raycaster.intersectObjects(this.globe.countries);
        if (intersectCountries.length > 0) {
            this.globe.countries.forEach((country) => {
                const material = (country as Mesh).material as MeshBasicMaterial;
                material.color.set(this.globe.outlineColor);
            });

            const intersected = intersectCountries[0].object as Mesh;
            (intersected.material as MeshBasicMaterial).color.set(this.globe.baseColor);

            this.locationContainer.textContent = intersected.userData.country;
        }
    }

    private handlePinRaycast() {
        const pins = this.pinManager.getPins();
        pins.forEach((pin) => {
            const intersects = this.raycaster.intersectObject(pin.getMarker());
            pin.setHoverState(intersects.length > 0);
        });

        const intersects = this.raycaster.intersectObjects(this.pinManager.getPinGroup().children);
        if (intersects.length > 0) {
            this.hoveredStoryId = intersects[0].object.userData.storyId;
            setHoverPin(true);
        } else {
            this.hoveredStoryId = -1;
            setHoverPin(false);
        }
    }

    private sampleTexture(texture: Texture, uv: Vector2) {
        const { image } = texture;
        if (!(image instanceof HTMLCanvasElement)) return null;

        const ctx = image.getContext("2d");
        if (!ctx) return null;

        const x = Math.floor(uv.x * image.width);
        const y = Math.floor((1 - uv.y) * image.height);
        return ctx.getImageData(x, y, 1, 1).data || new Uint8Array(4);
    }

    private onClick() {
        if (controlState()) {
            const state = { latitude: this.latitude, longitude: this.longitude };
            setLocation(state);
            toggleControl();
            this.navigate("/story/create");
        }

        if (hoverPin() && this.hoveredStoryId != -1 && this.hoveredStoryId != undefined) {
            this.navigate(`/story/${this.hoveredStoryId}`);
        }
    }

    private onResize() {
        this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.render(this.scene, this.camera);
    }
}
