import { useNavigate } from "@solidjs/router";
import { isAxiosError } from "axios";
import { createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import { APIResponseType } from "../../types/api"; // Adjust the import based on your project structure
import { FormSubmitEventType, InputEventType } from "../../types/events"; // Adjust the import based on your project structure
import { catchError } from "../../utils/common"; // Utility function for error handling
import { createStoryApi } from "../../services/storyService";

type StoryForm = {
    tittle: string;
    content: string;
    latitude: number;
    longitude: number;
};

export const useCreateStory = () => {
    const [isLoading, setIsLoading] = createSignal(false);
    const [error, setError] = createSignal<string | undefined>();
    const [fields, setFields] = createStore<StoryForm>({
        tittle: "",
        content: "",
        latitude: 0,
        longitude: 0,
    });

    const navigate = useNavigate();

    const handleInput = (e: InputEventType) => {
        const { name, value } = e.currentTarget;
        setFields(name as keyof StoryForm, value);
    };

    const handleSubmit = async (e: FormSubmitEventType) => {
        e.preventDefault();
        setIsLoading(true);
        setError(undefined); 

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
