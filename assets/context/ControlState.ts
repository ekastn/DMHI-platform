import { createRoot, createSignal } from "solid-js";

const createControlState = () => {
    const [controlState, setControleState] = createSignal(false);
    const [location, setLocation] = createSignal({
        latitude: 0,
        longitude: 0,
    });

    const toggleControl = () => {
        setControleState(!controlState());
    };

    return { controlState , toggleControl, location, setLocation };
};

export default createRoot(createControlState);
