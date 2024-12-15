import { A } from "@solidjs/router";
import { AiOutlineMessage } from "solid-icons/ai";
import { FaRegularCircleUser } from "solid-icons/fa";
import { IoLocationOutline, IoNotificationsOutline } from "solid-icons/io";
import { Component, Show } from "solid-js";
import { useAuth } from "../context/AuthContext";

const Navbar: Component = () => {
    const { isLoggedIn, logout } = useAuth();

    return (
        <div class="navbar select-none px-4 py-2 bg-transparent">
            <div class="navbar-start z-50">
                <A href="/" class="font-bold text-xl">
                    Voixes
                </A>
            </div>
            <div class="navbar-center space-x-2 text-md">
                <a>Location</a>
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
                    <A href="/chats" class="btn btn-ghost">
                        <AiOutlineMessage class="size-6" />
                    </A>
                    <A href="" class="btn btn-ghost">
                        <IoNotificationsOutline class="size-6" />
                    </A>
                    <button onClick={() => logout()} class="btn btn-ghost">
                        <FaRegularCircleUser class="size-6" />
                    </button>
                </Show>
            </div>
        </div>
    );
};

export default Navbar;
