import { BiRegularErrorCircle } from "solid-icons/bi";
import { Component, Match, Switch } from "solid-js";
import FloatingLayout from "../../components/FloatingLayout";
import ChatList from "./ChatList";
import { useChats } from "./useChats";

const Chats: Component = () => {
    const { chatRooms, isLoading, error } = useChats();

    return (
        <FloatingLayout>
            <div class="flex flex-col space-y-4">
                <div class="text-4xl font-medium p-4">Messages</div>
                <Switch>
                    <Match when={error()}>
                        <div role="alert" class="alert">
                            <BiRegularErrorCircle />
                            <span>{error()}</span>
                        </div>
                    </Match>
                    <Match when={error()}>
                        <div role="alert" class="alert">
                            <BiRegularErrorCircle />
                            <span>{error()}</span>
                        </div>
                    </Match>
                    <Match when={chatRooms()}>
                        <ChatList />
                    </Match>
                    <Match when={isLoading()}>
                        <div>loading...</div>
                    </Match>
                </Switch>
            </div>
        </FloatingLayout>
    );
};

export default Chats;
