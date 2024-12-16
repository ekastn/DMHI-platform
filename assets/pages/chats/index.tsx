import { BiRegularErrorCircle } from "solid-icons/bi";
import { FaSolidUser } from "solid-icons/fa";
import { Component, Show } from "solid-js";
import FloatingLayout from "../../components/FloatingLayout";
import { useChats } from "./useChats";

const Chats: Component = () => {
    const { chatRooms, isLoading, error } = useChats();

    return (
        <FloatingLayout>
            <div class="flex flex-col space-y-4">
                <div class="text-4xl font-medium p-4">Messages</div>
                <Show when={error()}>
                    <div role="alert" class="alert">
                        <BiRegularErrorCircle />
                        <span>{error()}</span>
                    </div>
                </Show>
                <Show when={!isLoading()} fallback={<div>Loading...</div>}>
                    {chatRooms()?.map((room) => (
                        <button class="w-full justify-start mb-2 p-3 rounded-lg hover:bg-primary-content">
                            <div class="flex items-start w-full space-x-4">
                                <FaSolidUser class="w-12 h-12" />
                                <div class="flex-1 space-y-1 text-left">
                                    <div class="flex items-center justify-between">
                                        <p class="text-lg font-medium leading-none">
                                            {room.user.username}
                                        </p>
                                        <p class="text-xs">
                                            {room.lastMessageTimestamps.toDateString()}
                                        </p>
                                    </div>
                                    <p class="text-sm prose">{room.lastMessage}</p>
                                    <p class="text-xs">{room.unreadCount}</p>
                                </div>
                            </div>
                        </button>
                    ))}
                </Show>
            </div>
        </FloatingLayout>
    );
};

export default Chats;
