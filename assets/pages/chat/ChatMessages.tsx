import { Component, For } from "solid-js";
import { MessageEventType } from "../../types/socket";
import { useAuth } from "../../context/AuthContext";

type PropsType = {
    messages: MessageEventType[];
}
const ChatMessages: Component<PropsType> = (props) => {
    const { user } = useAuth();

    const isMe = (userId: number) => user?.id === userId;

    return (
        <div class="flex-grow p-4 border rounded-md overflow-y-auto">
            <For each={props.messages}>
                {(message) => (
                    <div class={`chat ${isMe(message.userId) ? "chat-end" : "chat-start"}`}>
                        <div
                            class={`chat-bubble text-xl font-medium ${
                                isMe(message.userId)
                                    ? "bg-primary-content text-primary"
                                    : "bg-primary text-primary-content"
                            }`}
                        >
                            {message.content}
                        </div>
                    </div>
                )}
            </For>
        </div>
    );
};

export default ChatMessages;
