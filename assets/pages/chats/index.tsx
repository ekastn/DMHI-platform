import { Component } from "solid-js";
import FloatingLayout from "../../components/FloatingLayout";
import { FaSolidUser } from "solid-icons/fa";

const chatRooms = [
    {
        id: 1,
        name: "General",
        lastMessage: {
            content: "Has anyone seen the new movie?",
            sender: "Alice",
            timestamp: new Date(2023, 5, 15, 14, 30),
        },
    },
    {
        id: 2,
        name: "Technology",
        lastMessage: {
            content: "What do you think about the new AI developments?",
            sender: "Bob",
            timestamp: new Date(2023, 5, 15, 15, 45),
        },
    },
    {
        id: 3,
        name: "Random",
        lastMessage: {
            content:
                "II just found the funniest meme!I just found the funniest meme!I just found the funniest meme!I just found the funniest meme! just found the funniest meme!",
            sender: "Charlie",
            timestamp: new Date(2023, 5, 15, 16, 20),
        },
    },
    {
        id: 4,
        name: "Music",
        lastMessage: {
            content: "Who's going to the concert next week?",
            sender: "David",
            timestamp: new Date(2023, 5, 15, 17, 10),
        },
    },
    {
        id: 5,
        name: "Sports",
        lastMessage: {
            content: "Great game last night!",
            sender: "Eve",
            timestamp: new Date(2023, 5, 15, 18, 5),
        },
    },
];

const Chats: Component = () => {
    return (
        <FloatingLayout>
            <div class="flex flex-col space-y-4">
                <div class="text-4xl font-medium p-4">Messages</div>
                {chatRooms.map((room) => (
                    <button class="w-full justify-start mb-2 p-3 rounded-lg hover:bg-primary-content">
                        <div class="flex items-start w-full space-x-4">
                            <FaSolidUser class="w-12 h-12" />
                            <div class="flex-1 space-y-1 text-left">
                                <div class="flex items-center justify-between">
                                    <p class="text-lg font-medium leading-none">
                                        {room.lastMessage.sender}
                                    </p>
                                    <p class="text-xs">
                                        {room.lastMessage.timestamp.toDateString()}
                                    </p>
                                </div>
                                <p class="text-sm prose">{room.lastMessage.content}</p>
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </FloatingLayout>
    );
};

export default Chats;
