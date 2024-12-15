import { Navigate } from "@solidjs/router";
import { ParentComponent, Show } from "solid-js";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute: ParentComponent = (props) => {
    const { isLoggedIn } = useAuth();
    return (
        <Show when={isLoggedIn()} fallback={<Navigate href="/login" />}>
            <>{props.children}</>
        </Show>
    );
};

export default ProtectedRoute;
