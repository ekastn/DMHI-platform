import { A, Navigate, useLocation, useNavigate } from "@solidjs/router";
import { AiOutlineMessage } from "solid-icons/ai";
import { FaRegularCircleUser } from "solid-icons/fa";
import { IoCreate, IoLocationOutline, IoNotificationsOutline } from "solid-icons/io";
import { Component, createEffect, For, Show } from "solid-js";
import { useAuth } from "../context/AuthContext";
import ControlState from "../context/ControlState";
import { useWebSocket } from "../context/WebSocketContext";
import { formatDate } from "../utils/common";

const Navbar: Component = () => {
    const { isLoggedIn, logout } = useAuth();
    const { controlState, toggleControl } = ControlState;
    const { haveNewNotifications, notifications } = useWebSocket();

    const location = useLocation();
    const navigate = useNavigate();

    createEffect(() => {
        console.log(location.pathname);
    });

    const handleMessageClick = () => {
        if (location.pathname !== "/chats") {
            navigate("/chats");
        } else {
            navigate("/");
        }
    };

    return (
        <div class="navbar select-none px-4 py-2 bg-transparent">
            <div class="navbar-start z-50">
                <A href="/" class="font-bold text-xl">
                    Voixes
                </A>
            </div>
            <div class="navbar-center space-x-2 text-md z-10">
                <a id="location-indicator">Location</a>
                <IoLocationOutline />
            </div>
            <div class="navbar-end z-50">
                <Show
                    when={isLoggedIn()}
                    fallback={
                        <A href="/login" class="cursor-pointer hover:underline">
                            Log in
                        </A>
                    }
                >
                    <button onClick={handleMessageClick} class="btn btn-ghost">
                        <AiOutlineMessage class="size-6" />
                    </button>
                    <div class="dropdown dropdown-end">
                        <button class="btn btn-ghost">
                            <div class="indicator">
                                <IoNotificationsOutline class="size-6" />
                                <Show when={haveNewNotifications()}>
                                    <span class="badge badge-xs badge-primary indicator-item"></span>
                                </Show>
                            </div>
                        </button>
                        <Show when={notifications.length > 0}>
                            <ul class="menu dropdown-content bg-white rounded-box z-[1] w-60 p-2 overflow-y-auto shadow">
                                <For each={notifications}>
                                    {(notification) => (
                                        <li>
                                            <div class="flex flex-col items-start">
                                                <p class="font-medium">{notification.content}</p>
                                                <p class="text-xs font-thin">
                                                    {formatDate(notification.createdAt)}
                                                </p>
                                            </div>
                                        </li>
                                    )}
                                </For>
                            </ul>
                        </Show>
                    </div>
                    <div class="dropdown dropdown-end">
                        <button class="btn btn-ghost">
                            <FaRegularCircleUser class="size-6" />
                        </button>
                        <ul class="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                            <li>
                                <button>Profile</button>
                            </li>
                            <li>
                                <button onClick={logout}>Log Out</button>
                            </li>
                        </ul>
                    </div>
                    <button
                        onClick={toggleControl}
                        class={`btn btn-sm tooltip open tooltip-left ${controlState() ? "btn-neutral" : "btn-ghost"}`}
                        data-tip="Write a story"
                    >
                        <IoCreate class="size-6" />
                    </button>
                </Show>
            </div>
        </div>
    );
};

export default Navbar;
