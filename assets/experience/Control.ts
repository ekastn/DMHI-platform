import { Object3D, Vector2 } from "three";

export default class Control {
    private isDragging;
    private lastMousePosition;
    private momentum;
    private readonly rotationSpeedFactor;
    private readonly dampingFactor;

    private readonly target: Object3D;

    constructor(target: Object3D, rotationSpeedFactor = 0.005, dampingFactor = 0.95) {
        this.isDragging = false;
        this.lastMousePosition = new Vector2();
        this.momentum = new Vector2();
        this.target = target;
        this.rotationSpeedFactor = rotationSpeedFactor;
        this.dampingFactor = dampingFactor;
    }

    startDragging(x: number, y: number) {
        this.isDragging = true;
        this.lastMousePosition.set(x, y);
    }

    stopDragging() {
        this.isDragging = false;
    }

    handleMouseMove(x: number, y: number) {
        if (this.isDragging) {
            const dx = x - this.lastMousePosition.x;
            const dy = y - this.lastMousePosition.y;

            const rotationX = dy * this.rotationSpeedFactor;
            const rotationY = dx * this.rotationSpeedFactor;

            this.target.rotation.x += rotationX;
            this.target.rotation.y += rotationY;
            this.momentum.set(rotationY, rotationX);

            this.lastMousePosition.set(x, y);
        }
    }

    update() {
        if (!this.isDragging) {
            this.target.rotation.x += this.momentum.y;
            this.target.rotation.y += this.momentum.x;
            this.momentum.multiplyScalar(this.dampingFactor);
        }
    }
}
