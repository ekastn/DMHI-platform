import { Group, Scene } from "three";
import { PinEventType } from "../types/socket";
import Globe from "./Globe";
import Pin from "./Pin";
import { getListOfPinsApi } from "../services/pinServices";
import { catchError } from "../utils/common";
import { useWebSocket } from "../context/WebSocketContext";
import { createEffect } from "solid-js";

export default class PinManager {
    private pins: Pin[] = [];
    private pinGourp: Group = new Group();

    constructor(
        private globe: Globe,
        private scene: Scene
    ) {}

    public init() {
        this.scene.add(this.pinGourp);
        this.plotPins();
        this.initWebsocket();
    }

    public getPins() {
        return this.pins;
    }

    public getPinGroup() {
        return this.pinGourp;
    }

    private initWebsocket() {
        const { pin } = useWebSocket();
        createEffect(() => {
            if (pin.storyId !== 0) {
                this.createPin(pin);
            }
        });
    }

    private createPin(pin: PinEventType) {
        const { longitude, latitude, storyId } = pin;
        const newPin = new Pin(latitude, longitude, storyId, this.globe.radius);

        this.pinGourp.add(newPin.getMarker());
        this.pins.push(newPin);
    }

    private plotPins() {
        this.loadPins().then((pins) => {
            pins?.forEach((pin) => {
                this.createPin(pin);
            });
        });
    }

    private async loadPins() {
        const [error, data] = await catchError(getListOfPinsApi());
        if (error) console.error(error);
        return data?.data.pins;
    }
}
