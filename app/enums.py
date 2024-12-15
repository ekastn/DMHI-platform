from enum import Enum


class NotificationType(Enum):
    NEW_MESSAGE = "new_message"
    FRIEND_REQUEST = "friend_request"
    FRIEND_ACCEPT = "friend_accept"
    FRIEND_POST = "friend_post"
