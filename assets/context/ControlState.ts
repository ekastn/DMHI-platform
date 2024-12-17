import { createRoot, createSignal } from "solid-js";

const createControlState = () => {
    const [controlState, setControleState] = createSignal(false);

    const toggleControl = () => {
        setControleState(!controlState());
    };

    return { controlState , toggleControl };
};

export default createRoot(createControlState);
