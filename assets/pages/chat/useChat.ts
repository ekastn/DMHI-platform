import { useParams } from "@solidjs/router";
import { createEffect, createSignal, onMount } from "solid-js";
import { useWebSocket } from "../../context/WebSocketContext";
import { onCleanup } from "solid-js";

export const useChat = () => {
    const { messages, sendMessage, joinChatRoom, chatRoom, leaveChatRoom } = useWebSocket();
    const [message, setMessage] = createSignal("");
    const [isReady, setIsReady] = createSignal(false);

    const params = useParams();
    const chatId = parseInt(params.chatId);

    onMount(async () => {
        joinChatRoom(chatId);
    });

    onCleanup(() => {
        leaveChatRoom(chatId);
    });

    createEffect(() => {
        if (chatRoom.id === chatId) {
            setIsReady(true);
        }
    });

    const handleSendMessage = (e: Event) => {
        e.preventDefault();
        if (message().length > 0) {
            sendMessage(chatId, message());
            setMessage("");
        }
    };

    return { messages, chatRoom, setMessage, message, handleSendMessage, isReady };
};
