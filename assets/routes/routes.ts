import { RouteDefinition } from "@solidjs/router";
import Login from "../pages/login";
import Register from "../pages/register";

export const routes: RouteDefinition[] = [
    {
        path: "/login",
        component: Login,
    },
    {
        path: "/register",
        component: Register,
    }
]
