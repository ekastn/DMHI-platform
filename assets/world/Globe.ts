import {
    BufferGeometry,
    Color,
    DoubleSide,
    Float32BufferAttribute,
    Group,
    Line,
    LineBasicMaterial,
    Mesh,
    MeshBasicMaterial,
    Object3D,
    Raycaster,
    Scene,
    ShaderMaterial,
    SphereGeometry,
    Texture,
    Vector2,
} from "three";

import { FeatureCollection, MultiPolygon, Polygon, Position } from "geojson";
import { latLngToVector3 } from "../utils/math";
import { generateBorderTexture, generateCountryDataTexture } from "./CountriesGeneration";

type Coordinates = Position[][];

const vertexShader = `
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

const fragmentShader = `
uniform sampler2D uCountryDataTexture;
uniform int uHoverCountryId;
uniform vec3 uBaseColor;
uniform vec3 uHoverColor;
uniform vec3 uCountryColor;

varying vec2 vUv;

void main() {
    vec4 countryData = texture2D(uCountryDataTexture, vUv);

    int countryId = int(countryData.r * 255.0) * 65536 + int(countryData.g * 255.0) * 256 + int(countryData.b * 255.0);

    if (countryId == 0) {
        gl_FragColor = vec4(uBaseColor, 1.0);
    } else if (countryId == uHoverCountryId) {
        gl_FragColor = vec4(uHoverColor, 1.0);
    } else {
        gl_FragColor = vec4(1);
    }
}
`;

export default class Globe {
    readonly countries: Object3D[] = [];

    readonly radius = 10;
    private baseColor = 0x9f9e90;
    private outlineColor = 0x000000;
    private highlightColor = 0xccd5ae;

    private sphere: Mesh;
    private countryDataTexture: Texture | null = null;
    private borderTexture: Texture | null = null;
    private hoverCountryId: number = -1;

    private locationContainer: HTMLDivElement;

    constructor(private scene: Scene) {
        this.sphere = new Mesh(new SphereGeometry());
        this.locationContainer = document.getElementById("location-indicator") as HTMLDivElement;

        this.countries.push(this.sphere);

        this.init();
    }

    public async init(): Promise<void> {
        const geoData = await this.loadGeoJson("/public/geo/countries.json");

        this.countryDataTexture = new Texture(await generateCountryDataTexture(geoData));
        this.countryDataTexture.needsUpdate = true;

        this.createGlobe(128);
        this.scene.add(this.sphere);

        this.addRegions(geoData, this.radius * 1.01);
        this.countries.forEach((country) => {
            this.scene.add(country);
        });
    }

    private createGlobe(segments: number = 64) {
        const globeGeometry = new SphereGeometry(this.radius, segments, segments);

        const globeMaterial = new ShaderMaterial({
            uniforms: {
                uCountryDataTexture: { value: this.countryDataTexture },
                uHoverCountryId: { value: this.hoverCountryId },
                uBaseColor: { value: new Color(this.baseColor) },
                uHoverColor: { value: new Color(this.highlightColor) },
                uCountryColor: { value: new Color(0x00ff00) },
            },
            vertexShader,
            fragmentShader,
            side: DoubleSide,
        });

        this.sphere = new Mesh(globeGeometry, globeMaterial);
    }

    private updateHoverCountry(countryId: number): void {
        const material = this.sphere.material as ShaderMaterial;
        material.uniforms.uHoverCountryId.value = countryId;
    }

    public handleRaycast(raycaster: Raycaster) {
        const intersects = raycaster.intersectObject(this.sphere);

        if (intersects.length > 0) {
            const uv = intersects[0].uv;

            if (uv && this.countryDataTexture) {
                const pixelData = this.sampleTexture(this.countryDataTexture, uv);
                const countryId = this.getCountryIdFromColor(pixelData);

                if (countryId !== this.hoverCountryId) {
                    this.hoverCountryId = countryId;
                    this.updateHoverCountry(countryId);
                }
            }
        } else {
            if (this.hoverCountryId !== -1) {
                this.hoverCountryId = -1;
                this.updateHoverCountry(-1);
            }
        }


        const intersectCountries = raycaster.intersectObjects(this.countries);
        if (intersectCountries.length > 0) {
            this.countries.forEach((country) => {
                const material = (country as Mesh).material as MeshBasicMaterial;
                material.color.set(this.outlineColor);
            });

            const intersected = intersectCountries[0].object as Mesh;
            (intersected.material as MeshBasicMaterial).color.set(this.baseColor);

            this.locationContainer.textContent = intersected.userData.country;
        }
    }

    private addRegions(geoData: FeatureCollection, radius: number) {
        geoData.features.forEach((feature) => {
            const { type, coordinates } = feature.geometry as Polygon | MultiPolygon;
            const name: string = feature.properties?.NAME;
            if (type == "Polygon") {
                this.addRegion(coordinates, name, radius);
            } else if (type == "MultiPolygon") {
                coordinates.forEach((coord) => {
                    this.addRegion(coord, name, radius);
                });
            }
        });
    }

    private addRegion(coords: Coordinates, name: string, radius: number) {
        const vertices: number[] = [];
        coords[0].forEach(([lng, lat]) => {
            const vertex = latLngToVector3(lat, lng, radius);
            vertices.push(vertex.x, vertex.y, vertex.z);
        });

        const material = new LineBasicMaterial({ color: this.outlineColor, linewidth: 2 });
        const geometry = new BufferGeometry();
        geometry.setAttribute("position", new Float32BufferAttribute(vertices, 3));

        const line = new Line(geometry, material);
        line.userData.country = name;
        this.countries.push(line);
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

    private getCountryIdFromColor(color: Uint8Array | Uint8ClampedArray): number {
        const [r, g, b] = color;
        return r * 256 * 256 + g * 256 + b;
    }

    private async loadGeoJson(path: string) {
        const response = await fetch(path);
        if (!response.ok) throw new Error(`Failed to load GeoJSON: ${response.statusText}`);
        return await response.json();
    }
}
