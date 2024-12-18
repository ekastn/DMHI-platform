import { Component, createEffect, For } from "solid-js";
import { useAuth } from "../../context/AuthContext";
import { MessageEventType } from "../../types/socket";

type PropsType = {
    messages: MessageEventType[];
};

const ChatMessages: Component<PropsType> = (props) => {
    const { user } = useAuth();
    let messageRef: HTMLDivElement;

    const isMe = (userId: number) => user()?.id === userId;

    createEffect(() => {
        props.messages.length; // track messages store
        if (messageRef) {
            messageRef.scrollIntoView({ behavior: "smooth" });
        }
    })

    return (
        <div class="flex-grow p-4 border rounded-md overflow-y-auto">
            <For each={props.messages}>
                {(message) => (
                    <div class={`chat ${isMe(message.userId) ? "chat-end" : "chat-start"}`}>
                        <div
                            ref={messageRef}
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
