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
    readonly countries: Group;

    readonly radius: number;
    private readonly baseColor: number;
    private readonly outlineColor: number;
    private readonly highlightColor: number;

    constructor(scene: Scene) {
        this.radius = 10;
        this.baseColor = 0xfaedce;
        this.outlineColor = 0x000000;
        this.highlightColor = 0xccd5ae;
        this.countries = new Group();

        this.loadGeoJson("/public/geo/countries.json").then((geoData) =>
            this.addRegions(geoData, this.radius)
        );
        scene.add(this.countries);
    }

    public update() {}

    public handleRaycast(raycaster: Raycaster) {
        const intersects = raycaster.intersectObjects(this.countries.children);

        if (intersects.length > 0) {
            this.countries.children.forEach((country) => {
                const material = (country as Mesh).material as MeshBasicMaterial;
                material.color.set(this.outlineColor);
            });

            const intersected = intersects[0].object as Mesh;
            (intersected.material as MeshBasicMaterial).color.set(this.baseColor);

            (document.getElementById("location-indicator") as HTMLDivElement).textContent =
                intersected.userData.country;
        }
    }

    private addRegions(geoData: FeatureCollection, radius: number) {
        geoData.features.forEach((feature) => {
            const { type, coordinates } = feature.geometry as Polygon | MultiPolygon;
            const name: string = feature.properties?.NAME;
            if (type == "Polygon") {
                this.addRegion(coordinates, name);
            } else if (type == "MultiPolygon") {
                coordinates.forEach((coord) => {
                    this.addRegion(coord, name);
                });
            }
        });
    }

    private addRegion(coords: Coordinates, name: string) {
        const vertices: number[] = [];
        coords.forEach((ring) => {
            ring.forEach(([lng, lat]) => {
                const vertex = latLngToVector3(lat, lng, this.radius);
                vertices.push(vertex.x, vertex.y, vertex.z);
            });
        });

        const material = new LineBasicMaterial({ color: this.outlineColor });
        const geometry = new BufferGeometry();
        geometry.setAttribute("position", new Float32BufferAttribute(vertices, 3));

        const line = new Line(geometry, material);
        line.userData.country = name;

        this.countries.add(line);
    }

    private async loadGeoJson(path: string) {
        const response = await fetch(path);
        if (!response.ok) throw new Error(`Failed to load GeoJSON: ${response.statusText}`);
        return await response.json();
    }
}
