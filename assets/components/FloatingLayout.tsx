import { ParentComponent } from "solid-js/types/server/rendering.js";

const FloatingLayout: ParentComponent = (props) => {
    return (
        <div class="fixed inset-0 py-20">
            <div class="relative overflow-y-auto bg-white w-full h-full max-w-[46vw] rounded-lg shadow-lg p-8 left-[calc(100vw-50vw)]">
                {props.children}
            </div>
        </div>
    );
};

export default FloatingLayout;
