import { A } from "@solidjs/router";
import { FaSolidKey, FaSolidUser } from "solid-icons/fa";
import { Component, Show } from "solid-js";
import { useRegister } from "./useRegister";
import { BiRegularErrorCircle } from "solid-icons/bi";

const Register: Component = () => {
    const { isLoading, handleInput, handleSubmit, error } = useRegister();

    return (
        <div class="absolute flex items-center justify-center w-screen h-screen inset-0 backdrop-blur-lg">
            <div class="flex-1 flex items-center justify-center px-4">
                <div class="space-y-8">
                    <h2 class="text-3xl text-center">Register</h2>

                    <form onSubmit={handleSubmit} class="mt-8 space-y-6">
                        <Show when={error()}>
                            <div role="alert" class="alert">
                                <BiRegularErrorCircle />
                                <span>{error()}</span>
                            </div>
                        </Show>
                        <label class="input input-lg input-bordered flex items-center gap-4 bg-transparent">
                            <FaSolidUser />
                            <input
                                onInput={handleInput}
                                name="username"
                                type="text"
                                class="grow"
                                placeholder="Username"
                                required
                            />
                        </label>
                        <label class="input input-lg input-bordered flex items-center gap-4 bg-transparent">
                            <FaSolidKey />
                            <input
                                onInput={handleInput}
                                name="password"
                                type="password"
                                class="grow"
                                placeholder="Password"
                                required
                            />
                        </label>

                        <button
                            type="submit"
                            disabled={isLoading()}
                            class="btn btn-lg btn-neutral w-full rounded-full"
                        >
                            {!isLoading() ? (
                                "Create new account"
                            ) : (
                                <span class="loading loading-spinner loading-md"></span>
                            )}
                        </button>
                    </form>
                    <p class="text-center text-gray-400">
                        Already have an account?
                        <A href="/login" class="underline underline-offset-2 text-gray-800">
                            Log in here
                        </A>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
