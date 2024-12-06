import { A } from "@solidjs/router";
import { AiOutlineGoogle } from "solid-icons/ai";
import { FaSolidKey, FaSolidUser, FaSolidUserPlus } from "solid-icons/fa";
import { Component, Show } from "solid-js";
import { useLogin } from "./useLogin";
import { BiRegularErrorCircle } from "solid-icons/bi";

const Login: Component = () => {
    const { isLoading, handleInput, handleSubmit, error } = useLogin();

    return (
        <div class="absolute flex items-center justify-center w-screen h-screen inset-0 backdrop-blur-lg">
            <div class="flex flex-1 w-full max-w-5xl justify-center items-center gap-8">
                <div class="space-y-8 w-full">
                    <h2 class="text-3xl text-center">Log in</h2>

                    <form onSubmit={handleSubmit} class="form-control mt-8 space-y-6">
                        <div class="space-y-4">
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
                                />
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading()}
                            class="btn btn-lg btn-neutral w-full rounded-full"
                        >
                            {!isLoading() ? (
                                "Log in"
                            ) : (
                                <span class="loading loading-spinner loading-md"></span>
                            )}
                        </button>
                    </form>
                </div>

                <div class="divider divider-horizontal">OR</div>

                <div class="flex flex-col space-y-4 w-full">
                    <button class="btn btn-lg btn-outline rounded-full bg-base-100">
                        <AiOutlineGoogle />
                        Continue with Google
                    </button>
                    <A href="/register" class="btn btn-lg btn-outline rounded-full bg-base-100">
                        <FaSolidUserPlus />
                        Create an account
                    </A>
                </div>
            </div>
        </div>
    );
};

export default Login;
