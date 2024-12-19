import { NotificationType } from "../services/webSocketService";
import { UserType } from "./user.";

export type NotificationEventType = {
    id: number;
    type: NotificationType;
    content: string;
    isRead: boolean;
    createdAt: Date;
};

export type MessageEventType = {
    id: number;
    chatRoomId: number;
    userId: number;
    content: string;
    sentAt: Date;
};

export type LoadChatRoomEventType = {
    chatRoomId: number;
    recipient: UserType;
    messages: MessageEventType[];
};

export type PinEventType = {
    latitude: number;
    longitude: number;
    storyId: number;
};
