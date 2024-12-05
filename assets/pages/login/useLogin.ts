import { createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import { loginUser } from "../../services/authService";
import { InputEventType, FormSubmitEventType } from "../../types/events";

type LoginForm = {
    username: string;
    password: string;
};

export const useLogin = () => {
    const [isLoading, setIsLoading] = createSignal(false);
    const [fields, setFields] = createStore<LoginForm>({
        username: "",
        password: "",
    });

    const handleInput = (e: InputEventType) => {
        const { name, value } = e.currentTarget;
        setFields(name as keyof LoginForm, value);
    };

    const handleSubmit = async (e: FormSubmitEventType) => {
        e.preventDefault();
        setIsLoading(true);
        const data = await loginUser(fields.username, fields.password);
        console.log(data);
        setIsLoading(false);
    };

    return { isLoading, fields, handleInput, handleSubmit };
};
