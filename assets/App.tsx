import { onMount, ParentComponent } from "solid-js";

import Navbar from "./components/Navbar";
import World from "./world/World";

const App: ParentComponent = (props) => {
    let worldRef: HTMLCanvasElement;

    onMount(() => {
        const world = new World(worldRef);
        world.start();
    });

    return (
        <div class="w-screen h-screen overflow-hidden">
            <Navbar />
            <main class="w-screen h-screen">
                <canvas
                    class="absolute select-none w-screen h-screen inset-0 -z-50"
                    ref={worldRef!}
                />
                {props.children}
            </main>
        </div>
    );
};

export default App;
