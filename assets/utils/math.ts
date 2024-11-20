import { Vector3 } from "three";

export function latLngToVector3(lat: number, lng: number, radius: number): Vector3 {
    const phi = lat * Math.PI / 180;
    const theta = lng * Math.PI / 180;

    return new Vector3(
        radius * Math.cos(phi) * Math.cos(theta),
        radius * Math.sin(phi),
        -radius * Math.cos(phi) * Math.sin(theta)
    );
}
