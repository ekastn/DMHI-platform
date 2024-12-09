import { RouteDefinition } from "@solidjs/router";
import Login from "../pages/login";
import Register from "../pages/register";
import StoryThreads from "../pages/story";

export const routes: RouteDefinition[] = [
    {
        path: "/login",
        component: Login,
    },
    {
        path: "/register",
        component: Register,
    },
    {
        path: "/threads",
        component: StoryThreads,
    }
]
