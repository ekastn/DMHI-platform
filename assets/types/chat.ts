import { UserType } from "./user.";

export type ChatRoomType = {
    id: number;
    lastMessage: string;
    lastMessageTimestamps: Date;
    unreadCount: number;
    user: UserType;
};
