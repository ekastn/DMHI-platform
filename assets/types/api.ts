export type APIResponseType<T = null> = {
    success: boolean;
    message: string;
    data: T;
};

export type ChatRoomType = {
    id: number;
    last_message: string | null;
    unread_message_count: number;
    created_at: string;
    users: ChatParticipantType[];
    messages: MessageType[];
};

export type ChatParticipantType = {
    chat_room_id: number;
    user_id: number;
};

export type MessageType = {
    id: number;
    chat_room_id: number;
    user_id: number;
    content: string;
    is_delivered: boolean;
    sent_at: string;
};

export type NotificationType = {
    id: number;
    user_id: number;
    type: string;
    content: string;
    is_read: boolean;
    created_at: string;
    reference_id: number;
};

export type PinType = {
    id: number;
    latitude: number;
    longitude: number;
    story_id: number;
};

export type StoryType = {
    id: number;
    title: string;
    content: string;
    created_at: string;
    updated_at: string;
    user_id: number;
    pin: PinType;
};

export type UserType = {
    id: number;
    username: string;
    email: string;
    password_hash: string;
    google_id: string;
    stories: StoryType[];
    chat_rooms: ChatParticipantType[];
    messages: MessageType[];
    notifications: NotificationType[];
};
