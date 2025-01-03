import { FaSolidUser } from "solid-icons/fa";
import { For } from "solid-js";
import { Component } from "solid-js/types/server/rendering.js";
import { useChats } from "./useChats";

const ChatList: Component = () => {
    const { chatRooms, handleClickChatRoom } = useChats();
    return (
        <For each={chatRooms()}>
            {(room) => (
                <button
                    onClick={() => handleClickChatRoom(room.id)}
                    class="w-full justify-start mb-2 p-3 rounded-lg hover:bg-primary-content"
                >
                    <div class="flex items-start w-full space-x-4">
                        <FaSolidUser class="w-12 h-12" />
                        <div class="flex-1 space-y-1 text-left">
                            <div class="flex items-center justify-between">
                                <p class="text-lg font-medium leading-none">{room.user.username}</p>
                                <p class="text-xs">{room.lastMessageTimestamps.toDateString()}</p>
                            </div>
                            <p class="text-sm prose">{room.lastMessage}</p>
                        </div>
                    </div>
                </button>
            )}
        </For>
    );
};

export default ChatList;
