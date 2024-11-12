import { beforeEach, describe, expect, it } from "vitest";
import { Object3D } from "three";

import Control from "../../assets/experience/Control";

describe("Navigation Control", () => {
    let control: Control;
    let target: Object3D;

    beforeEach(() => {
        target = new Object3D();
        control = new Control(target);
    });

    it("should start dragging", () => {
        control.startDragging(100, 200);
        expect(control["isDragging"]).toBe(true);
        expect(control["lastMousePosition"].x).toBe(100);
        expect(control["lastMousePosition"].y).toBe(200);
    });

    it("should stop dragging", () => {
        control.startDragging(100, 200);
        control.stopDragging();
        expect(control["isDragging"]).toBe(false);
    });

    it("should apply rotation based on mouse movement when dragging", () => {
        control.startDragging(100, 200);
        control.handleMouseMove(150, 250);

        expect(target.rotation.x).not.toBe(0);
        expect(target.rotation.y).not.toBe(0);
    });

    it("should apply momentum and damping when not dragging", () => {
        control.startDragging(100, 200);
        control.handleMouseMove(150, 250);
        control.stopDragging();

        const initialRotationY = target.rotation.y;
        const initialMomentum = control["momentum"].clone(); 

        control.update();

        expect(control["momentum"].length()).toBeLessThan(initialMomentum.length());

        const newRotationY = target.rotation.y;
        if (initialMomentum.x > 0) {
            expect(newRotationY).toBeGreaterThanOrEqual(initialRotationY);
        } else {
            expect(newRotationY).toBeLessThanOrEqual(initialRotationY);
        }
    });
});
