import { BsSendFill } from "solid-icons/bs";
import { FaRegularCircleUser } from "solid-icons/fa";
import { For, Show } from "solid-js";
import { Component } from "solid-js/types/server/rendering.js";
import ChatMessages from "./ChatMessages";
import { useChat } from "./useChat";
import FloatingLayout from "../../components/FloatingLayout";

const messages = [
    {
        userId: 1,
        content: "What kind of nonsense is this",
    },
    {
        userId: 2,
        content: "Put me on the Council and not make me a Master!?",
    },
    {
        userId: 2,
        content: "That's never been done in the history of the Jedi. It's insulting!",
    },
    {
        userId: 1,
        content: "Calm down, Anakin.",
    },
    {
        userId: 1,
        content: "You have been given a great honor.",
    },
    {
        userId: 1,
        content: "To be on the Council at your age.",
    },
    {
        userId: 2,
        content: "It's never happened before",
    },
    {
        userId: 1,
        content: "To be on the Council at your age.",
    },
    {
        userId: 1,
        content: "To be on the Council at your age.",
    },
    {
        userId: 1,
        content: "To be on the Council at your age.",
    },
];

const Chat: Component = () => {
    const { chatRoom, messages, message, setMessage, handleSendMessage, isReady } = useChat();

    return (
        <FloatingLayout>
            <Show when={isReady()} fallback={<div>loading...</div>}>
                <div class="flex flex-col h-full">
                    <div class="flex space-x-4 items-center p-2">
                        <FaRegularCircleUser size={"2rem"} />
                        <h2 class="text-4xl">{chatRoom.recipient.username}</h2>
                    </div>
                    <ChatMessages messages={messages} />
                    <form onSubmit={handleSendMessage} class="flex space-x-4">
                        <input
                            onInput={(e) => setMessage(e.currentTarget.value)}
                            value={message()}
                            type="text"
                            placeholder="Type here"
                            class="input input-bordered input-primary w-full"
                        />
                        <button class="btn btn-primary w-20" type="submit">
                            <BsSendFill />
                        </button>
                    </form>
                </div>
            </Show>
        </FloatingLayout>
    );
};

export default Chat;
