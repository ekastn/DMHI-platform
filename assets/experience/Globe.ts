import earcut from "earcut";
import {
    BufferGeometry,
    Float32BufferAttribute,
    Group,
    Line,
    LineBasicMaterial,
    Mesh,
    MeshBasicMaterial,
    Raycaster,
    Scene,
} from "three";

import { FeatureCollection, MultiPolygon, Polygon, Position } from "geojson";
import { latLngToVector3 } from "../utils/math";

type Coordinates = Position[][];

export default class Globe {
    readonly regions: Group;

    private readonly radius: number;
    private readonly baseColor: number;
    private readonly outlineColor: number;
    private readonly highlightColor: number;

    constructor(scene: Scene) {
        this.radius = 10;
        this.baseColor = 0xfaedce;
        this.outlineColor = 0x000000;
        this.highlightColor = 0xccd5ae;
        this.regions = new Group();

        this.loadGeoJson("/geo/countries.json").then((geoData) =>
            this.addRegions(geoData, this.radius)
        );
        scene.add(this.regions);
    }

    public handleRaycast(raycaster: Raycaster) {
        const intersects = raycaster.intersectObjects(this.regions.children, true);

        this.regions.children.forEach((region: Mesh) => {
            const material = region.material as MeshBasicMaterial;
            if (region.name == "land") material.color.set(this.baseColor);
        });

        if (intersects.length > 0) {
            const intersected = intersects[0].object as Mesh;
            if (intersected.name == "land")
                (intersected.material as MeshBasicMaterial).color.set(this.highlightColor);
        }
    }

    private addRegions(geoData: FeatureCollection, radius: number) {
        geoData.features.forEach((feature) => {
            const { type, coordinates } = feature.geometry as Polygon | MultiPolygon;
            if (type == "Polygon") {
                this.addRegion(coordinates, radius);
            } else if (type == "MultiPolygon") {
                coordinates.forEach((coord) => {
                    this.addRegion(coord, radius);
                });
            }
        });
        console.log(this.regions);
    }

    private addRegion(coords: Coordinates, radius: number) {
        // const geometry = this.createRegionGeometry(coords, radius);
        // const material = new MeshBasicMaterial({
        //     color: this.baseColor,
        //     side: DoubleSide,
        // });
        // const mesh = new Mesh(geometry, material);
        // mesh.name = "land";
        // this.regions.add(mesh);
        this.drawOutlineRegion(coords, radius - 0.1);
    }

    private drawOutlineRegion(coords: Coordinates, radius: number) {
        const vertices: number[] = [];
        coords[0].forEach(([lng, lat]) => {
            const vertex = latLngToVector3(lat, lng, radius);
            vertices.push(vertex.x, vertex.y, vertex.z);
        });
        const material = new LineBasicMaterial({ color: this.outlineColor });
        const geometry = new BufferGeometry();
        geometry.setAttribute("position", new Float32BufferAttribute(vertices, 3));
        this.regions.add(new Line(geometry, material));
    }

    private createRegionGeometry(coords: Coordinates, radius: number) {
        const vertices: number[] = [];
        const holes: number[] = [];
        const flattenedVertices: number[] = [];

        coords.forEach((ring, ringIndex) => {
            const startIdx = flattenedVertices.length / 2;

            ring.forEach(([lng, lat]) => {
                const vector = latLngToVector3(lat, lng, radius);
                vertices.push(vector.x, vector.y, vector.z);

                // For Earcut, flatten lat/lng for triangulation
                flattenedVertices.push(vector.x, vector.y);
            });

            if (ringIndex > 0) {
                holes.push(startIdx);
            }
        });

        const indices = earcut(flattenedVertices, holes);

        const geometry = new BufferGeometry();
        geometry.setAttribute("position", new Float32BufferAttribute(vertices, 3));
        geometry.setIndex(indices);

        return geometry;
    }

    async loadGeoJson(path: string) {
        const response = await fetch(path);
        if (!response.ok) throw new Error(`Failed to load GeoJSON: ${response.statusText}`);
        return response.json();
    }
}
