import { useNavigate } from "@solidjs/router";
import { isAxiosError } from "axios";
import { createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import ControlState from "../../context/ControlState";
import { createStoryApi } from "../../services/storyService";
import { APIResponseType } from "../../types/api";
import { FormSubmitEventType, InputEventTextAreaType, InputEventType } from "../../types/events";
import { catchError } from "../../utils/common";

type StoryForm = {
    tittle: string;
    content: string;
};

export const useCreateStory = () => {
    const [isLoading, setIsLoading] = createSignal(false);
    const [error, setError] = createSignal<string | undefined>();
    const [fields, setFields] = createStore({ tittle: "", content: "" });
    const { location } = ControlState;

    const navigate = useNavigate();

    const handleInput = (e: InputEventType | InputEventTextAreaType) => {
        const { name, value } = e.currentTarget;
        setFields(name as keyof StoryForm, value);
    };

    const handleSubmit = async (e: FormSubmitEventType) => {
        e.preventDefault();
        setIsLoading(true);
        setError(undefined);

        const [error, data] = await catchError(
            createStoryApi(fields.tittle, fields.content, location().latitude, location().longitude)
        );

        if (error && isAxiosError<APIResponseType>(error)) {
            setError(error.response?.data.message);
        } else {
            setIsLoading(false);
            navigate("/");
        }

        setIsLoading(false);
    };

    return { isLoading, fields, handleInput, handleSubmit, error };
};
