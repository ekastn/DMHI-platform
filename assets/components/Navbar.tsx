import { Component } from "solid-js";

const Navbar: Component = () => {
    return (
        <div class="navbar px-4 py-2 bg-transparent">
            <div class="navbar-start">
                <h2 class="font-bold text-xl">Voixes</h2>
            </div>
            <div class="navbar-center space-x-2 text-md">
                <a>Location</a>
                <svg
                    class="size-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                    />
                </svg>
            </div>
            <div class="navbar-end">
                <a class="cursor-pointer hover:underline">Log in</a>
            </div>
        </div>
    );
};

export default Navbar;
