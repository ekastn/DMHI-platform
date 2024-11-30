import { A } from "@solidjs/router";
import { AiOutlineGoogle } from "solid-icons/ai";
import { FaSolidKey, FaSolidUser, FaSolidUserPlus } from "solid-icons/fa";
import { Component } from "solid-js";
import { createStore } from "solid-js/store";
import { FormSubmitEventType, InputEventType } from "../../types/events";

type LoginForm = {
    username: string;
    password: string;
};

const Login: Component = () => {
    const [fields, setFields] = createStore<LoginForm>({
        username: "",
        password: "",
    });

    const handleInput = (e: InputEventType) => {
        const { name, value } = e.currentTarget;
        setFields(name as keyof LoginForm, value);
    };

    const handleSubmit = (e: FormSubmitEventType) => {
        e.preventDefault();
        console.log(JSON.stringify(fields));
    };

    return (
        <div class="absolute flex items-center justify-center w-screen h-screen inset-0">
            <div class="flex flex-1 w-full max-w-5xl justify-center items-center gap-8">
                <div class="space-y-8 w-full">
                    <h2 class="text-3xl text-center">Log in</h2>

                    <form onSubmit={handleSubmit} class="form-control mt-8 space-y-6">
                        <div class="space-y-4">
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

                        <button type="submit" class="btn btn-lg btn-neutral w-full rounded-full">
                            Log in
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
