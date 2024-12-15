import { NotificationType } from "../services/webSocketService";

export type Notification = {
    id: number;
    type: NotificationType;
    content: string;
    isRead: boolean;
    createdAt: Date;
};

export type Message = {
    id: number;
    chatRoomId: number;
    userId: number;
    content: string;
    isDelivered: boolean;
    sentAt: Date;
};
