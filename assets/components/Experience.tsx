import { onMount } from "solid-js";
import World from "../world/World";

const Experience = () => {
    let worldRef: HTMLCanvasElement;

    onMount(() => {
        const world = new World(worldRef!);
        world.start();
    });

    return <canvas class="absolute select-none w-screen h-screen inset-0" ref={worldRef!} />;
};

export default Experience;
