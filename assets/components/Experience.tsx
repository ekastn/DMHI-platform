import { onMount } from "solid-js";
import World from "../world/World";

const Experience = () => {
    let worldRef: HTMLDivElement;

    onMount(() => {
        const world = new World(worldRef!);
        world.start();
    });

    return <div class="absolute select-none w-screen h-screen inset-0" ref={worldRef!} />;
};

export default Experience;
