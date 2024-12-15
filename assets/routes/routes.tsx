import { RouteDefinition } from "@solidjs/router";
import Login from "../pages/login";
import Register from "../pages/register";
import CreateStory from "../pages/createStory";
import Story from "../pages/story";
import ProtectedRoute from "./ProtectedRoute";

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
        path: "/create-story",
        component: () => <ProtectedRoute><CreateStory /></ProtectedRoute>,
    },
    {
        path: "/story/:storyId",
        component: Story,
    }
]
