import { useNavigate, useParams } from "@solidjs/router";
import { isAxiosError } from "axios";
import { createSignal, onMount } from "solid-js";
import { createStore } from "solid-js/store";
import { APIResponseType } from "../../types/api"; // Adjust import path as needed
import { catchError } from "../../utils/common"; // Utility function for error handling
import { readStoryApi, updateStoryApi, deleteStoryApi } from "../../services/storyService";
import { InputEventTextAreaType, InputEventType } from "../../types/events";
import { StoryType } from "../../types/story";

type StoryForm = {
    title: string;
    content: string;
};

export const useViewStory = () => {
    const [isLoading, setIsLoading] = createSignal(true);
    const [error, setError] = createSignal<string | undefined>();
    const [isEditing, setIsEditing] = createSignal(false);
    const [story, setStory] = createStore<Partial<StoryType>>({});
    const [fields, setFields] = createStore<StoryForm>({
        title: "",
        content: "",
    });

    const param = useParams();
    const storyId = parseInt(param.storyId);

    const navigate = useNavigate();

    onMount(async () => {
        await fetchStory();
    })
    
    const handleInput = (e: InputEventType | InputEventTextAreaType) => {
        const { name, value } = e.currentTarget;
        setFields(name as keyof StoryForm, value);
    };

    const fetchStory = async () => {
        setIsLoading(true);
        setError(undefined);

        const [err, res] = await catchError(readStoryApi(storyId));

        if (err && isAxiosError<APIResponseType>(err)) {
            setError(err.response?.data.message);
        } else {
            if (res?.data.story) {
                setStory(res.data.story);
                const story = {
                    title: res.data.story.title,
                    content: res.data.story.content,
                }
                setFields(story);
            }
        }

        setIsLoading(false);
    };

    // Update the story
    const handleUpdate = async () => {
        setIsLoading(true);
        setError(undefined);

        const [err, res] = await catchError(
            updateStoryApi(storyId, fields.title, fields.content)
        );

        if (err && isAxiosError<APIResponseType>(err)) {
            setError(err.response?.data.message);
        } else {
            setStory(res?.data.story!);
            setIsEditing(false);
        }

        setIsLoading(false);
    };

    // Delete the story
    const handleDelete = async () => {
        if (confirm("Are you sure you want to delete this story?")) {
            setIsLoading(true);
            setError(undefined);
            const [err] = await catchError
            (deleteStoryApi(storyId)
            );
            if (err && isAxiosError<APIResponseType>(err)) {
                setError(err.response?.data.message);
            } else {
                navigate("/"); 
            }

            setIsLoading(false);
        }
    };

    return {
        story,
        isLoading,
        error,
        isEditing,
        setIsEditing,
        fetchStory,
        handleUpdate,
        handleDelete,
        fields,
        handleInput,
    };
};
