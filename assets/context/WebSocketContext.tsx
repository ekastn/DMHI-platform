import { createContext, ParentComponent, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import { SocketEventType, webSocketService } from "../services/webSocketService";
import {
    LoadChatRoomEventType,
    MessageEventType,
    NotificationEventType,
    PinEventType,
} from "../types/socket";
import { PinType } from "../types/story";
import { UserType } from "../types/user.";

type ChatRoomStoreType = {
    id: number;
    recipient: UserType;
};

type WebSocketContextType = {
    notifications: NotificationEventType[];
    messages: MessageEventType[];
    chatRoom: ChatRoomStoreType;
    pin: PinEventType;
    connect: () => void;
    disconnect: () => void;
    joinChatRoom: (chatRoomId: number) => void;
    leaveChatRoom: (chatRoomId: number) => void;
    sendMessage: (chatRoomId: number, content: string) => void;
    haveNewNotifications: () => boolean;
    sendPin: (latitude: number, longitude: number, storyId: number) => void;
};

const WebSocketContext = createContext<WebSocketContextType>();

export const WebSocketProvider: ParentComponent = (props) => {
    const [notifications, setNotifications] = createStore<NotificationEventType[]>([]);
    const [messages, setMessages] = createStore<MessageEventType[]>([]);
    const [chatRoom, setChatRoom] = createStore<ChatRoomStoreType>({} as ChatRoomStoreType);
    const [pin, setPin] = createStore<PinEventType>({
        latitude: 0,
        longitude: 0,
        storyId: 0,
    });

    const connect = () => {
        webSocketService.connect();

        webSocketService.on<NotificationEventType[]>(SocketEventType.NOTIFICATION, (data) => {
            setNotifications(data);
        });

        webSocketService.on<LoadChatRoomEventType>(SocketEventType.LOAD_CHAT_ROOM, (data) => {
            setChatRoom({
                id: data.chatRoomId,
                recipient: data.recipient,
            });
            setMessages(data.messages);
        });

        webSocketService.on<MessageEventType>(SocketEventType.NEW_MESSAGE, (data) => {
            setMessages((prev) => [...prev, data]);
        });

        webSocketService.on<PinEventType>(SocketEventType.NEW_PIN, (data) => {
            setPin("latitude", data.latitude);
            setPin("longitude", data.longitude);
            setPin("storyId", data.storyId);
        });
    };

    const disconnect = () => {
        webSocketService.disconnect();
        setMessages([]);
        setNotifications([]);
        setChatRoom({} as ChatRoomStoreType);
    };

    const joinChatRoom = (chatRoomId: number) => {
        webSocketService.emit(SocketEventType.ENTER_CHAT_ROOM, { chatRoomId });
        setMessages([]);
    };

    const leaveChatRoom = (chatRoomId: number) => {
        webSocketService.emit(SocketEventType.LEAVE_CHAT_ROOM, { chatRoomId });
    };

    const sendMessage = (chatRoomId: number, content: string) => {
        webSocketService.emit(SocketEventType.SEND_MESSAGE, { chatRoomId, content });
    };

    const haveNewNotifications = () => {
        return notifications.some((notification) => notification.isRead == false);
    };

    const sendPin = (latitude: number, longitude: number, storyId: number) => {
        webSocketService.emit(SocketEventType.NEW_PIN, { latitude, longitude, storyId });
    };

    return (
        <WebSocketContext.Provider
            value={{
                notifications,
                messages,
                connect,
                disconnect,
                joinChatRoom,
                leaveChatRoom,
                sendMessage,
                chatRoom,
                haveNewNotifications,
                pin,
                sendPin,
            }}
        >
            {props.children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => {
    const context = useContext(WebSocketContext);
    if (!context) {
        throw new Error("WebSocketContext not found. Ensure it is wrapped in WebSocketProvider.");
    }
    return context;
};
