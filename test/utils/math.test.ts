import { describe, expect, it } from "vitest";

import { latLngToVector3 } from "../../assets/utils/math";
import { Vector3 } from "three";

describe("Math Utils", () => {
    it("latLngToVector3 should convert lat/lng to a Vector3 correctly", () => {
        const lat = 37.7749;
        const lng = -122.4194;
        const radius = 10; 

        const expectedVal = new Vector3(
            -radius * Math.sin((90 - lat) * (Math.PI / 180)) * Math.cos((lng + 180) * (Math.PI / 180)),
            radius * Math.cos((90 - lat) * (Math.PI / 180)),
            radius * Math.sin((90 - lat) * (Math.PI / 180)) * Math.sin((lng + 180) * (Math.PI / 180))
        );

        const result = latLngToVector3(lat, lng, radius);

        expect(result.x).toBeCloseTo(expectedVal.x);
        expect(result.y).toBeCloseTo(expectedVal.y);
        expect(result.z).toBeCloseTo(expectedVal.z);
    });

    it("should handle the North Pole correctly (90° latitude)", () => {
        const lat = 90;
        const lng = 0;
        const radius = 10;

        const expectedVal = new Vector3(0, radius, 0);

        const result = latLngToVector3(lat, lng, radius);

        expect(result.x).toBeCloseTo(expectedVal.x);
        expect(result.y).toBeCloseTo(expectedVal.y);
        expect(result.z).toBeCloseTo(expectedVal.z);
    })

    it("should handle the South Pole correctly (-90° latitude)", () => {
        const lat = -90;
        const lng = 0;
        const radius = 10;

        const expectedVal = new Vector3(0, -radius, 0);

        const result = latLngToVector3(lat, lng, radius);

        expect(result.x).toBeCloseTo(expectedVal.x);
        expect(result.y).toBeCloseTo(expectedVal.y);
        expect(result.z).toBeCloseTo(expectedVal.z);
    });
});
