import { useLocation, useNavigate } from "@solidjs/router";
import { isAxiosError } from "axios";
import { createSignal, onMount } from "solid-js";
import { createStore } from "solid-js/store";
import { APIResponseType } from "../../types/api";
import { FormSubmitEventType, InputEventType } from "../../types/events";
import { catchError } from "../../utils/common";
import { createStoryApi } from "../../services/storyService";
import { InputEventTextAreaType } from "../../types/events";
import ControlState from "../../context/ControlState";

type StoryForm = { tittle: string; content: string; latitude: number; longitude: number };

export const useCreateStory = () => {
    const [isLoading, setIsLoading] = createSignal(false);
    const [error, setError] = createSignal<string | undefined>();
    const [fields, setFields] = createStore({ tittle: "", content: "", latitude: 0, longitude: 0 });

    const navigate = useNavigate();
    onMount(() => {
        const { location } = ControlState;
        const data = useLocation();
        const state = data.state as { latitude: number; longitude: number };

        let latitude: number = location().latitude;
        let longitude: number = location().longitude;

        if (location().latitude === 0 && location().longitude === 0) {
            latitude = state?.latitude || 0;
            longitude = state?.longitude || 0;
        }
        setFields("latitude", latitude);
        setFields("longitude", longitude);
    });

    const handleInput = (e: InputEventType | InputEventTextAreaType) => {
        const { name, value } = e.currentTarget;
        setFields(name as keyof StoryForm, value);
    };

    const handleSubmit = async (e: FormSubmitEventType) => {
        e.preventDefault();
        setIsLoading(true);
        setError(undefined);
        console.log(JSON.stringify(fields));

        const [error] = await catchError(
            createStoryApi(
                fields.tittle,
                fields.content,
                parseFloat(fields.latitude.toString()),
                parseFloat(fields.longitude.toString())
            )
        );

        if (error && isAxiosError<APIResponseType>(error)) {
            setError(error.response?.data.message);
        } else {
            navigate("/");
        }

        setIsLoading(false);
    };

    return { isLoading, fields, handleInput, handleSubmit, error };
};
