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

export function vector3ToLatLng(vector: Vector3): { lat: number; lng: number } {
    const radius = vector.length(); 
    const phi = Math.asin(vector.y / radius); 
    const theta = Math.atan2(-vector.z, vector.x);

    // degree conversion
    const lat = phi * (180 / Math.PI);
    const lng = theta * (180 / Math.PI);

    return { lat, lng };
}
