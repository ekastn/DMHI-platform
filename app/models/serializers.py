from app.models.chat import ChatRoom, ChatParticipant
from app.models.message import Message
from app.models.notification import Notification
from app.models.pin import Pin
from app.models.story import Story
from app.models.user import User

def serialize_chat_room(chat_room: ChatRoom) -> dict:
    return {
        "id": chat_room.id,
        "last_message": chat_room.last_message,
        "unread_message_count": chat_room.unread_message_count,
        "created_at": chat_room.created_at.isoformat(),
        "users": [serialize_chat_participant(user) for user in chat_room.users],
        "messages": [serialize_message(message) for message in chat_room.messages],
    }

def deserialize_chat_room(data: dict) -> ChatRoom:
    return ChatRoom(
        id=data["id"],
        last_message=data["last_message"],
        unread_message_count=data["unread_message_count"],
        created_at=data["created_at"],
        users=[deserialize_chat_participant(user) for user in data["users"]],
        messages=[deserialize_message(message) for message in data["messages"]],
    )

def serialize_chat_participant(chat_participant: ChatParticipant) -> dict:
    return {
        "chat_room_id": chat_participant.chat_room_id,
        "user_id": chat_participant.user_id,
    }

def deserialize_chat_participant(data: dict) -> ChatParticipant:
    return ChatParticipant(
        chat_room_id=data["chat_room_id"],
        user_id=data["user_id"],
    )

def serialize_message(message: Message) -> dict:
    return {
        "id": message.id,
        "chat_room_id": message.chat_room_id,
        "user_id": message.user_id,
        "content": message.content,
        "is_delivered": message.is_delivered,
        "sent_at": message.sent_at.isoformat(),
    }

def deserialize_message(data: dict) -> Message:
    return Message(
        id=data["id"],
        chat_room_id=data["chat_room_id"],
        user_id=data["user_id"],
        content=data["content"],
        is_delivered=data["is_delivered"],
        sent_at=data["sent_at"],
    )

def serialize_notification(notification: Notification) -> dict:
    return {
        "id": notification.id,
        "user_id": notification.user_id,
        "type": notification.type.value,
        "content": notification.content,
        "is_read": notification.is_read,
        "created_at": notification.created_at.isoformat(),
        "reference_id": notification.reference_id,
    }

def deserialize_notification(data: dict) -> Notification:
    return Notification(
        id=data["id"],
        user_id=data["user_id"],
        type=data["type"],
        content=data["content"],
        is_read=data["is_read"],
        created_at=data["created_at"],
        reference_id=data["reference_id"],
    )

def serialize_pin(pin: Pin) -> dict:
    return {
        "id": pin.id,
        "latitude": pin.latitude,
        "longitude": pin.longitude,
        "story_id": pin.story_id,
    }

def deserialize_pin(data: dict) -> Pin:
    return Pin(
        id=data["id"],
        latitude=data["latitude"],
        longitude=data["longitude"],
        story_id=data["story_id"],
    )

def serialize_story(story: Story) -> dict:
    return {
        "id": story.id,
        "title": story.title,
        "content": story.content,
        "created_at": story.created_at.isoformat(),
        "updated_at": story.updated_at.isoformat(),
        "user_id": story.user_id,
        "pin": serialize_pin(story.pin),
    }

def deserialize_story(data: dict) -> Story:
    return Story(
        id=data["id"],
        title=data["title"],
        content=data["content"],
        created_at=data["created_at"],
        updated_at=data["updated_at"],
        user_id=data["user_id"],
        pin=deserialize_pin(data["pin"]),
    )

def serialize_user(user: User) -> dict:
    return {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "password_hash": user.password_hash,
        "google_id": user.google_id,
        "stories": [serialize_story(story) for story in user.stories],
        "chat_rooms": [serialize_chat_participant(chat_room) for chat_room in user.chat_rooms],
        "messages": [serialize_message(message) for message in user.messages],
        "notifications": [serialize_notification(notification) for notification in user.notifications],
    }

def deserialize_user(data: dict) -> User:
    return User(
        id=data["id"],
        username=data["username"],
        email=data["email"],
        password_hash=data["password_hash"],
        google_id=data["google_id"],
        stories=[deserialize_story(story) for story in data["stories"]],
        chat_rooms=[deserialize_chat_participant(chat_room) for chat_room in data["chat_rooms"]],
        messages=[deserialize_message(message) for message in data["messages"]],
        notifications=[deserialize_notification(notification) for notification in data["notifications"]],
    )
