import { A, useLocation, useNavigate } from "@solidjs/router";
import { AiOutlineMessage } from "solid-icons/ai";
import { FaRegularCircleUser } from "solid-icons/fa";
import { HiOutlinePencil } from "solid-icons/hi";
import { IoLocationOutline, IoNotificationsOutline } from "solid-icons/io";
import { Component, Show } from "solid-js";
import { useAuth } from "../context/AuthContext";
import ControlState from "../context/ControlState";
import { useWebSocket } from "../context/WebSocketContext";

const Navbar: Component = () => {
    const { isLoggedIn, logout } = useAuth();
    const { controlState, toggleControl } = ControlState;
    const { haveNewNotifications } = useWebSocket();

    const { user } = useAuth();

    const location = useLocation();
    const navigate = useNavigate();

    const handleMessageClick = () => {
        if (location.pathname !== "/chats") {
            navigate("/chats");
        } else {
            navigate("/");
        }
    };

    const handleProfileClick = () => {
        navigate(`/user/${user()?.id}}`);
    };

    const handleNotificationClick = () => {
        if (location.pathname !== "/notifications") {
            navigate("/notifications");
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
                    <button onClick={handleNotificationClick} class="btn btn-ghost">
                        <div class="indicator">
                            <IoNotificationsOutline class="size-6" />
                            <Show when={haveNewNotifications()}>
                                <span class="badge badge-xs badge-primary indicator-item"></span>
                            </Show>
                        </div>
                    </button>
                    <div class="dropdown dropdown-end">
                        <button class="btn btn-ghost">
                            <FaRegularCircleUser class="size-6" />
                        </button>
                        <ul class="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                            <li>
                                <button onClick={handleProfileClick}>Profile</button>
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
                        <HiOutlinePencil class="size-6" />
                    </button>
                </Show>
            </div>
        </div>
    );
};

export default Navbar;
