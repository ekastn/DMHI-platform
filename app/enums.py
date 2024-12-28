from enum import Enum


class NotificationType(Enum):
    NEW_MESSAGE = "new_message"
    FRIEND_REQUEST = "friend_request"
    FRIEND_ACCEPT = "friend_accept"
    FRIEND_POST = "friend_post"


class FriendRequestStatusType(Enum):
    PENDING = "pending"
    ACCEPTED = "accepted"
    REJECTED = "rejected"


class SocketEventType(Enum):
    SEND_MESSAGE = "send_message"
    NEW_MESSAGE = "new_message"
    LOAD_CHAT_ROOM = "load_chat_room"
    LOAD_NOTIFICATION = "load_notification"
    NEW_NOTIFICATION = "new_notification"
    ENTER_CHAT_ROOM = "enter_chat_room"
    LEAVE_CHAT_ROOM = "leave_chat_room"
    NEW_PIN = "new_pin"
