import { Mesh, MeshBasicMaterial, SphereGeometry } from "three";
import { latLngToVector3 } from "../utils/math";


export default class Pin {
    private marker: Mesh;
    private radius = 0.1;

    constructor(
        public latitude: number,
        public longitude: number,
        public storyId: number,
        globeRadius: number
    ) {
        const material = new MeshBasicMaterial({ color: 0xff0000 });
        const geometry = new SphereGeometry(this.radius, 32, 32);
        this.marker = new Mesh(geometry, material);
        this.marker.userData.storyId = this.storyId;

        const position = latLngToVector3(latitude, longitude, globeRadius);
        this.marker.position.copy(position);
    }

    public getMarker(): Mesh {
        return this.marker;
    }

    public setColor(color: number) {
        const material = this.marker.material as MeshBasicMaterial;
        material.color.set(color);
    }

    public setHoverState(isHovered: boolean) {
        const color = isHovered ? 0x00ff00 : 0xff0000;
        this.setColor(color);
    }
}
