import { createContext, ParentComponent, useContext } from "solid-js";
import { createStore, produce } from "solid-js/store";
import { SocketEventType, webSocketService } from "../services/webSocketService";
import { Message } from "../types/socket";

type WebSocketContextType = {
    notifications: Notification[];
    messages: Message[];
    connect: () => void;
    disconnect: () => void;
    joinChatRoom: (chatRoomId: string) => void;
    leaveChatRoom: (chatRoomId: string) => void;
    sendMessage: (chatRoomId: string, content: string) => void;
};

const WebSocketContext = createContext<WebSocketContextType>();

export const WebSocketProvider: ParentComponent = (props) => {
    const [notifications, setNotifications] = createStore<Notification[]>([]);
    const [messages, setMessages] = createStore<Message[]>([]);

    const connect = () => {
        webSocketService.connect();

        webSocketService.on<Notification[]>(SocketEventType.NOTIFICATION, (data) => {
            setNotifications(data);
        });

        webSocketService.on<Message[]>(SocketEventType.LOAD_MESSAGES, (data) => {
            setMessages(data);
        });

        webSocketService.on<Message>(SocketEventType.NEW_MESSAGE, (data) => {
            setMessages(
                produce((messages) => {
                    messages.push(data);
                })
            );
        });
    };

    const disconnect = () => {
        webSocketService.disconnect();
    };

    const joinChatRoom = (chatRoomId: string) => {
        webSocketService.emit(SocketEventType.ENTER_CHAT_ROOM, { chatRoomId });
        setMessages([]);
    };

    const leaveChatRoom = (chatRoomId: string) => {
        webSocketService.emit(SocketEventType.LEAVE_CHAT_ROOM, { chatRoomId });
    };

    const sendMessage = (chatRoomId: string, content: string) => {
        webSocketService.emit(SocketEventType.SEND_MESSAGE, { chatRoomId, content });
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
