import { A } from "@solidjs/router";
import { Component, Show } from "solid-js";
import { useAuth } from "../context/AuthContext";
import { IoLocationOutline } from "solid-icons/io";

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
                    when={!isLoggedIn()}
                    fallback={
                        <button onClick={() => logout()} class="cursor-pointer hover:underline">
                            Log out
                        </button>
                    }
                >
                    <A href="/login" class="cursor-pointer hover:underline">
                        Log in
                    </A>
                </Show>
            </div>
        </div>
    );
};

export default Navbar;
