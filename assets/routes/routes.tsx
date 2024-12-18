import { RouteDefinition } from "@solidjs/router";
import Login from "../pages/login";
import Register from "../pages/register";
import CreateStory from "../pages/createStory";
import Story from "../pages/story";
import ProtectedRoute from "./ProtectedRoute";
import Chat from "../pages/chat";
import Chats from "../pages/chats";
import Profile from "../pages/profile";

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
        path: "/chats",
        children: [
            {
                path: "/",
                component: Chats,
            },
            {
                path: "/:chatId",
                component: Chat,
                matchFilters: { chatId: /^\d+$/ },
            },
        ],
    },
    {
        path: "/story",
        children: [
            {
                path: "/create",
                component: () => (
                    <ProtectedRoute>
                        <CreateStory />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/:storyId",
                component: Story,
            },
        ],
    },
    {
        path: "/user/:userId",
        component: Profile,
    },
];
