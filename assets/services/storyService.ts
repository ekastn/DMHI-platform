import axios from "axios";
import { APIResponseType } from "../types/api";
import { StoryType } from "../types/story";

type StoryThreads = { story: StoryType };

export const createStoryApi = async (
    title: string,
    content: string,
    latitude: number,
    longitude: number
) => {
    const { data } = await axios.post<APIResponseType<StoryThreads>>("/api/story/", {
        title,
        content,
        latitude,
        longitude,
    });
    return data;
};

export const readStoryApi = async (storyId: number) => {
    const { data } = await axios.get<APIResponseType<StoryThreads>>(`/api/story/${storyId}`);
    return data;
};

export const updateStoryApi = async (storyId: number, title: string, content: string) => {
    const { data } = await axios.put<APIResponseType<StoryThreads>>(`/api/story/${storyId}`, {
        title,
        content,
    });
    return data;
};

export const deleteStoryApi = async (storyId: string) => {
    const { data } = await axios.delete<APIResponseType>(`/story/${storyId}`);
    return data;
};
