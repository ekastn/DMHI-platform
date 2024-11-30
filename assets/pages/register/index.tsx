import { A } from "@solidjs/router";
import { FaSolidKey, FaSolidUser } from "solid-icons/fa";
import { Component } from "solid-js";
import { createStore } from "solid-js/store";
import { FormSubmitEventType, InputEventType } from "../../types/events";

type RegisterForm = {
    username: string;
    password: string;
};

const Register: Component = () => {
    const [fields, setFields] = createStore<RegisterForm>({
        username: "",
        password: "",
    });

    const handleInput = (e: InputEventType) => {
        const { name, value } = e.currentTarget;
        setFields(name as keyof RegisterForm, value);
    };

    const handleSubmit = (e: FormSubmitEventType) => {
        e.preventDefault();
        console.log(JSON.stringify(fields));
    };

    return (
        <div class="absolute flex items-center justify-center w-screen h-screen inset-0">
            <div class="flex-1 flex items-center justify-center px-4">
                <div class="space-y-8">
                    <h2 class="text-3xl text-center">Register</h2>

                    <form onSubmit={handleSubmit} class="mt-8 space-y-6">
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

                        <button type="submit" class="btn btn-lg btn-neutral w-full rounded-full">
                            Create new account
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
