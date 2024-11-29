import { Component, onMount } from "solid-js";
import Navbar from "./components/Navbar";
import World from "./world/World";

const App: Component = () => {
    let worldRef: HTMLCanvasElement;
    let navbarRef: HTMLDivElement;

    onMount(() => {
        const world = new World(worldRef);
        world.start();
    });

    return (
        <main class="w-screen h-screen">
            <Navbar ref={navbarRef} />
            <canvas class="absolute select-none w-screen h-screen inset-0 -z-50" ref={worldRef} />
        </main>
    );
};

export default App;
