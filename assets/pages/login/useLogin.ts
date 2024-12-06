import { useNavigate } from "@solidjs/router";
import { isAxiosError } from "axios";
import { createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import { useAuth } from "../../context/AuthContext";
import { APIResponseType } from "../../types/api";
import { FormSubmitEventType, InputEventType } from "../../types/events";
import { catchError } from "../../utils/common";

type LoginForm = {
    username: string;
    password: string;
};

export const useLogin = () => {
    const [isLoading, setIsLoading] = createSignal(false);
    const [error, setError] = createSignal<string | undefined>();
    const [fields, setFields] = createStore<LoginForm>({
        username: "",
        password: "",
    });

    const { login, isLoggedIn } = useAuth();
    const navigate = useNavigate();
    if (isLoggedIn()) {
        navigate("/");
    }

    const handleInput = (e: InputEventType) => {
        const { name, value } = e.currentTarget;
        setFields(name as keyof LoginForm, value);
    };

    const handleSubmit = async (e: FormSubmitEventType) => {
        e.preventDefault();
        setIsLoading(true);
        const [error] = await catchError(login(fields.username, fields.password));
        if (error && isAxiosError<APIResponseType>(error)) {
            setError(error.response?.data.message);
        }
        setIsLoading(false);
    };

    return { isLoading, fields, handleInput, handleSubmit, error };
};
