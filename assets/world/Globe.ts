import {
    BufferGeometry,
    Color,
    DoubleSide,
    Float32BufferAttribute,
    Line,
    LineBasicMaterial,
    Mesh,
    Object3D,
    Scene,
    ShaderMaterial,
    SphereGeometry,
    Texture
} from "three";

import { FeatureCollection, MultiPolygon, Polygon, Position } from "geojson";
import { latLngToVector3 } from "../utils/math";
import { generateCountryDataTexture } from "./CountriesGeneration";

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
    readonly baseColor = 0x9f9e90;
    readonly outlineColor = 0x000000;
    readonly highlightColor = 0xccd5ae;

    public sphere: Mesh;
    private countryDataTexture: Texture | null = null;
    private hoverCountryId: number = -1;

    constructor(private scene: Scene) {
        this.sphere = new Mesh(new SphereGeometry());
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

    public updateHoverCountry(countryId: number): void {
        const material = this.sphere.material as ShaderMaterial;
        material.uniforms.uHoverCountryId.value = countryId;
    }

    public getCountryIdFromColor(color: Uint8Array | Uint8ClampedArray): number {
        const [r, g, b] = color;
        return r * 256 * 256 + g * 256 + b;
    }

    public getCountryDataTexture() {
        return this.countryDataTexture;
    }

    public getHoverCountryId(): number {
        return this.hoverCountryId;
    }

    public setHoverCountryId(countryId: number): void {
        this.hoverCountryId = countryId;
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

    private async loadGeoJson(path: string) {
        const response = await fetch(path);
        if (!response.ok) throw new Error(`Failed to load GeoJSON: ${response.statusText}`);
        return await response.json();
    }
}
