import { useNavigate } from "@solidjs/router";
import { Component, createSignal, For, Show } from "solid-js";
import FloatingLayout from "../../components/FloatingLayout";
import { useWebSocket } from "../../context/WebSocketContext";
import { NotificationType } from "../../services/webSocketService";
import { NotificationEventType } from "../../types/socket";
import { catchError, formatDate } from "../../utils/common";
import { updateFriendRequestApi } from "../../services/userService";

const Notifications: Component = () => {
    const [isLoading, setIsLoading] = createSignal(false);
    const { notifications } = useWebSocket();
    const navigate = useNavigate();

    const handleClickNotification = (notification: NotificationEventType) => {
        switch (notification.type) {
            case NotificationType.NEW_MESSAGE:
                navigate(`/chats/${notification.referenceId}`);
                break;
        }
    };

    const updateFriendRequest = async (userId: number, accept: boolean) => {
        setIsLoading(true);
        const [error] = await catchError(updateFriendRequestApi(userId, accept));
        if (error) {
            console.log(error.message);
        }
        setIsLoading(false);
    };

    return (
        <FloatingLayout>
            <div class="text-4xl font-medium p-4">Notifications</div>
            <Show when={notifications.length > 0}>
                <For each={notifications}>
                    {(notification) => (
                        <div
                            onClick={() => handleClickNotification(notification)}
                            class="flex justify-between cursor-pointer p-4 hover:bg-primary/5"
                        >
                            <div class="flex flex-col items-start ">
                                <p class="font-medium text-lg">{notification.content}</p>
                                <p class="text-xs font-thin">
                                    {formatDate(notification.createdAt)}
                                </p>
                            </div>
                            <Show when={notification.type == NotificationType.FRIEND_REQUEST}>
                                <div class="flex justify-center items-center space-x-4 h-full">
                                    <button
                                        onClick={() =>
                                            updateFriendRequest(notification.referenceId, true)
                                        }
                                        disabled={isLoading()}
                                        class="btn btn-sm btn-primary"
                                    >
                                        Accept
                                    </button>
                                    <button
                                        onClick={() =>
                                            updateFriendRequest(notification.referenceId, false)
                                        }
                                        disabled={isLoading()}
                                        class="btn btn-sm btn-outline"
                                    >
                                        Decline
                                    </button>
                                </div>
                            </Show>
                        </div>
                    )}
                </For>
            </Show>
        </FloatingLayout>
    );
};

export default Notifications;
