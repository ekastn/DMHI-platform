import { onMount } from "solid-js";
import { useWebSocket } from "../../context/WebSocketContext"
import { useParams } from "@solidjs/router";

export const useChat = () => {
    const { messages, sendMessage, joinChatRoom } = useWebSocket();
    const { chatId } = useParams();

    onMount(() => {
        console.log("Room id", chatId)
        console.log("Messages", JSON.stringify(messages))
        joinChatRoom(chatId);
    });

    return { messages, sendMessage, joinChatRoom };
}
