import { MathUtils, PerspectiveCamera, Vector3 } from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

export default class Control {
    private orbitControl: OrbitControls;
    private minDistance = 12;
    private maxDistance = 30;
    private baseRotationSpeed = 1;
    private cameraTarget = new Vector3(0, 0, 0);

    constructor(
        private camera: PerspectiveCamera,
        target: HTMLElement
    ) {
        this.orbitControl = new OrbitControls(camera, target);
        this.orbitControl.enableDamping = true;
        this.orbitControl.dampingFactor = 0.1;

        this.orbitControl.minDistance = this.minDistance;
        this.orbitControl.maxDistance = this.maxDistance;

        this.orbitControl.enablePan = false;

        this.orbitControl.addEventListener("change", () => {
            this.adjustRotationSpeed();
        });
    }

    update() {
        this.orbitControl.update();
    }

    private adjustRotationSpeed() {
        const distance = this.camera.position.distanceTo(this.cameraTarget);
        const mappedDistance = MathUtils.mapLinear(distance, this.minDistance, this.maxDistance, 0.07, 0.5)
        this.orbitControl.rotateSpeed = this.baseRotationSpeed * mappedDistance;
    }
}
