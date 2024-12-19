import { Mesh, MeshBasicMaterial, Raycaster, Scene, SphereGeometry } from "three";
import { latLngToVector3 } from "../utils/math";
import ControlState from "../context/ControlState";

const { setHoverPin, hoverPin } = ControlState;

export default class Pin {
    marker: Mesh;
    radius = 0.1;

    constructor(
        public latitude: number,
        public longitude: number,
        public storyId: number,
        private scene: Scene,
        radius: number
    ) {
        const material = new MeshBasicMaterial({ color: 0xff0000 });
        const geometry = new SphereGeometry(this.radius, 32, 32);
        this.marker = new Mesh(geometry, material);
        this.marker.userData.storyId = this.storyId

        const position = latLngToVector3(latitude, longitude, radius);
        this.marker.position.copy(position);

        this.scene.add(this.marker);
    }

    public handleRaycast(raycaster: Raycaster) {
        const intersects = raycaster.intersectObject(this.marker);
        const material = this.marker.material as MeshBasicMaterial;

        setHoverPin(false);

        material.color.set(0xff0000);
        if (intersects.length > 0) {
            material.color.set(0x00ff00);
            setHoverPin(true);
            console.log(hoverPin());
        }
    }
}
