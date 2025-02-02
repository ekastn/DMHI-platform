import { Socket, io } from "socket.io-client";

export const enum SocketEventType {
    CONNECT = "connect",
    DISCONNECT = "disconnect",
    LOAD_NOTIFICATION = "load_notification",
    NEW_NOTIFICATION = "new_notification",
    REMOVE_NOTIFICATION = "remove_notification",
    ENTER_CHAT_ROOM = "enter_chat_room",
    LEAVE_CHAT_ROOM = "leave_chat_room",
    SEND_MESSAGE = "send_message",
    LOAD_CHAT_ROOM = "load_chat_room",
    NEW_MESSAGE = "new_message",
    NEW_PIN = "new_pin",
}

export const enum NotificationType {
    NEW_MESSAGE = "new_message",
    FRIEND_REQUEST = "friend_request",
    FRIEND_ACCEPT = "friend_accept",
    FRIEND_POST = "friend_post",
}

export class WebSocketService {
    private socket: Socket | null = null;

    connect() {
        if (this.socket) return;

        this.socket = io();

        this.socket.on(SocketEventType.CONNECT, () => {
            console.log("WebSocket connected");
        });

        this.socket.on(SocketEventType.DISCONNECT, () => {
            console.log("WebSocket disconnected");
        });
    }

    disconnect() {
        this.socket?.disconnect();
        this.socket = null;
    }

    on<T>(event: SocketEventType, callback: (data: T) => void) {
        this.socket?.on(event, callback);
    }

    emit(event: SocketEventType, data?: unknown) {
        this.socket?.emit(event, data);
    }
}

export const webSocketService = new WebSocketService();
