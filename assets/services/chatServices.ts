import axios from "axios";
import { APIResponseType } from "../types/api";
import { ChatRoomType } from "../types/chat";

type ChatRoomPayload = { chatRooms: ChatRoomType[] };

export const getChatListApi = async () => {
    const { data } = await axios.get<APIResponseType<ChatRoomPayload>>("/api/chats/");
    data.data.chatRooms = data.data.chatRooms.map((room) => {
        room.lastMessageTimestamps = new Date(room.lastMessageTimestamps);
        return room;
    });
    return data;
};

export const getOrCreateChatApi = async (recipientId: number) => {
    const { data } = await axios.patch<APIResponseType<{ chatRoomId: number }>>("/api/chats/", {
        recipientId,
    });
    return data;
};
