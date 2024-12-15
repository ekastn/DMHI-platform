import { For } from "solid-js";

const ChatMessages = (props) => {
    return (
        <div class="flex-grow p-4 border rounded-md overflow-y-auto">
            <For each={props.messages}>
                {(message) => (
                    <div class={`chat ${message.userId == 1 ? "chat-end" : "chat-start"}`}>
                        <div
                            class={`chat-bubble text-xl font-medium ${
                                message.userId == 1
                                    ? "bg-primary-content text-primary"
                                    : "bg-primary text-primary-content"
                            }`}
                        >
                            What kind of nonsense is this
                        </div>
                    </div>
                )}
            </For>
        </div>
    );
};

export default ChatMessages;
