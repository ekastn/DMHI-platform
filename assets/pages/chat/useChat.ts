import { useParams } from "@solidjs/router";
import { createEffect, createSignal, onMount } from "solid-js";
import { useWebSocket } from "../../context/WebSocketContext";

export const useChat = () => {
    const { messages, sendMessage, joinChatRoom, chatRoom } = useWebSocket();
    const [message, setMessage] = createSignal("");
    const [isReady, setIsReady] = createSignal(false);

    const params = useParams();
    const chatId = parseInt(params.chatId);

    onMount(async () => {
        joinChatRoom(chatId);
    });

    createEffect(() => {
        if (chatRoom.id === chatId) {
            setIsReady(true);
        }
        console.log(messages)
    });

    const handleSendMessage = (e: Event) => {
        e.preventDefault();
        console.log(message().length);
        if (message().length > 0) {
            sendMessage(chatId, message());
            setMessage("");
        }
    };

    return { messages, chatRoom, setMessage, message, handleSendMessage, isReady };
};
