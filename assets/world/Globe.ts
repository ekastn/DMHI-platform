import {
    BufferGeometry,
    DoubleSide,
    Float32BufferAttribute,
    Group,
    Line,
    LineBasicMaterial,
    Mesh,
    MeshBasicMaterial,
    Raycaster,
    RingGeometry,
    Scene,
    SphereGeometry,
    Vector3,
} from "three";

import { FeatureCollection, MultiPolygon, Polygon, Position } from "geojson";
import { latLngToVector3 } from "../utils/math";
import ControlState from "../context/ControlState";

type Coordinates = Position[][];

const { controlState } = ControlState;

export default class Globe {
    readonly countries: Group;

    private readonly radius: number;
    private readonly baseColor: number;
    private readonly outlineColor: number;
    private readonly highlightColor: number;

    private globe: Mesh;
    private marker: Mesh;
    private highlightRing: Mesh;
    private markerTargetPosition = new Vector3();
    private normalIntersactionPoint = new Vector3();

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

        const sphere = new SphereGeometry(this.radius, 64, 64);
        const material = new MeshBasicMaterial({ color: this.baseColor});
        this.globe = new Mesh(sphere, material);
        // this.globe.visible = false;
        scene.add(this.globe);

        const markerGeometry = new SphereGeometry(0.09, 32, 32);
        const markerMaterial = new MeshBasicMaterial({ color: 0xff0000 });
        this.marker = new Mesh(markerGeometry, markerMaterial);
        scene.add(this.marker);
        this.marker.visible = false;

        const ringGeometry = new RingGeometry(0.06, 0.3, 32);
        const ringMaterial = new MeshBasicMaterial({
            color: 0x210232,
            side: DoubleSide,
            transparent: true,
            opacity: 0.5,
        });
        this.highlightRing = new Mesh(ringGeometry, ringMaterial);
        scene.add(this.highlightRing);
        this.highlightRing.visible = false;
    }

    public update() {
        if (this.marker.visible) {
            this.marker.position.lerp(this.markerTargetPosition, 0.3);
            this.highlightRing.position.lerp(this.markerTargetPosition, 0.3);

            const scale = 1 + Math.sin(Date.now() * 0.005) * 0.2;
            this.marker.scale.set(scale, scale, scale);
        }
    }

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

        if (!controlState()) {
            this.marker.visible = false;
            this.highlightRing.visible = false;
            return;
        }

        const intersectsGlobe = raycaster.intersectObject(this.globe);
        if (intersectsGlobe.length > 0) {
            this.marker.visible = false;
            const intersectionPoint = intersectsGlobe[0].point;

            this.normalIntersactionPoint = intersectionPoint.clone().normalize();

            this.markerTargetPosition.copy(intersectionPoint);
            this.highlightRing.lookAt(intersectionPoint.clone().add(this.normalIntersactionPoint));

            this.marker.visible = true;
            this.highlightRing.visible = true;

            const sphereRadius = this.globe.geometry.parameters.radius;
            const phi = Math.acos(intersectionPoint.y / sphereRadius);
            const theta = Math.atan2(intersectionPoint.z, intersectionPoint.x);
            const latitude = (90 - (phi * 180) / Math.PI).toFixed(2);
            const longitude = ((theta * 180) / Math.PI + 360) % 360;

            console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
        } else {
            this.highlightRing.visible = false;
            this.marker.visible = false;
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
