import { IoNotificationsOutline } from "solid-icons/io";
import { Component, For, Show } from "solid-js";
import { useWebSocket } from "../context/WebSocketContext";
import { NotificationEventType } from "../types/socket";
import { formatDate } from "../utils/common";
import { NotificationType } from "../services/webSocketService";
import { useNavigate } from "@solidjs/router";

const NotificationDropdown: Component = () => {
    const { haveNewNotifications, notifications } = useWebSocket();
    const navigate = useNavigate();

    const handleClickNotification = (notification: NotificationEventType) => {
        switch (notification.type) {
            case NotificationType.NEW_MESSAGE:
                navigate(`/chats/${notification.referenceId}`);
                break;
        }
    };

    return (
        <div class="dropdown dropdown-end">
            <button tabIndex={0} role="button" class="btn btn-ghost">
                <div class="indicator">
                    <IoNotificationsOutline class="size-6" />
                    <Show when={haveNewNotifications()}>
                        <span class="badge badge-xs badge-primary indicator-item"></span>
                    </Show>
                </div>
            </button>
            <Show when={notifications.length > 0}>
                <ul
                    tabIndex={0}
                    class="menu dropdown-content bg-white rounded-box z-[1] w-60 p-2 overflow-y-auto shadow"
                >
                    <For each={notifications}>
                        {(notification) => (
                            <li>
                                <div
                                    onClick={() => handleClickNotification(notification)}
                                    class="flex flex-col items-start"
                                >
                                    <p class="font-medium">{notification.content}</p>
                                    <p class="text-xs font-thin">
                                        {formatDate(notification.createdAt)}
                                    </p>
                                </div>
                            </li>
                        )}
                    </For>
                </ul>
            </Show>
        </div>
    );
};

export default NotificationDropdown;
