import { Mesh, MeshBasicMaterial, SphereGeometry } from "three";

export default class Globe {
    private readonly radius: number;
    private readonly geometry: SphereGeometry;
    private readonly material: MeshBasicMaterial;
    private readonly mesh: Mesh;

    constructor() {
        this.radius = 10;
        this.geometry = new SphereGeometry(this.radius);
        this.material = new MeshBasicMaterial({
            color: 0x000,
            wireframe: true,
        });
        this.mesh = new Mesh(this.geometry, this.material);
    }

    getMesh() {
        return this.mesh;
    }
}
