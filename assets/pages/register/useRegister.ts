import { createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import { registerUser } from "../../services/authService";
import { FormSubmitEventType, InputEventType } from "../../types/events";

type RegisterForm = {
    username: string;
    password: string;
};

export const useRegister = () => {
    const [isLoading, setIsLoading] = createSignal(false);
    const [fields, setFields] = createStore<RegisterForm>({
        username: "",
        password: "",
    });

    const handleInput = (e: InputEventType) => {
        const { name, value } = e.currentTarget;
        setFields(name as keyof RegisterForm, value);
    };

    const handleSubmit = async (e: FormSubmitEventType) => {
        e.preventDefault();
        setIsLoading(true);
        const data = await registerUser(fields.username, fields.password);
        console.log(data);
        setIsLoading(false);
    };

    return { isLoading, fields, handleInput, handleSubmit };
};
