import { isAxiosError } from "axios";
import { createSignal, onMount } from "solid-js";
import { getChatListApi } from "../../services/chatServices";
import { APIResponseType } from "../../types/api";
import { ChatRoomType } from "../../types/chat";
import { catchError } from "../../utils/common";

export const useChats = () => {
    const [chatRooms, setChatRooms] = createSignal<ChatRoomType[]>();
    const [isLoading, setIsLoading] = createSignal(true);
    const [error, setError] = createSignal<string>();

    onMount(async () => {
        const [error, data] = await catchError(getChatListApi());

        if (error && isAxiosError<APIResponseType>(error)) {
            setError(error.response?.data.message);
        }

        if (data?.success) {
            setChatRooms(data.data.chatRooms);
        }
        setIsLoading(false);
    });

    return { chatRooms, isLoading, error };
};
