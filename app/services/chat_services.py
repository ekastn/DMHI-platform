from typing import List

from flask import current_app
from sqlalchemy import func

from app import db
from app.models.chat import ChatParticipant, ChatRoom
from app.models.message import Message
from app.models.user import User


def get_unread_message_count(chat_room_id: int, user_id: int) -> int:
    return (
        Message.query.filter_by(chat_room_id=chat_room_id, is_delivered=False)
        .filter(Message.user_id != user_id)
        .count()
    )


def get_chat_rooms(user_id: int) -> List[dict]:
    chat_rooms = (
        ChatRoom.query.join(ChatParticipant, ChatRoom.id == ChatParticipant.chat_room_id)
        .join(User, ChatParticipant.user_id == User.id)
        .filter(ChatParticipant.user_id == user_id)
        .order_by(ChatRoom.last_message_timestamp.desc())
        .all()
    )

    chat_room_responses = []
    for chat_room in chat_rooms:
        unread_count = get_unread_message_count(chat_room.id, user_id)

        other_user = next((participant.user for participant in chat_room.users if participant.user_id != user_id), None)

        chat_room_responses.append(
            {
                "id": chat_room.id,
                "lastMessage": chat_room.last_message,
                "unreadCount": unread_count,
                "user": {
                    "id": other_user.id,
                    "username": other_user.username,
                },
                "lastMessageTimestamp": chat_room.last_message_timestamp.isoformat(),
            }
        )

    return chat_room_responses


def get_or_create_chat_room(user_id: int, recipient_id: int) -> ChatRoom:
    chat = ChatRoom.query.filter(
        ChatRoom.users.any(ChatParticipant.user_id == user_id),
        ChatRoom.users.any(ChatParticipant.user_id == recipient_id),
    ).first()

    if not chat:
        try:
            chat = ChatRoom()
            chat.users.append(ChatParticipant(user_id=user_id))
            chat.users.append(ChatParticipant(user_id=recipient_id))
            db.session.add(chat)
            db.session.commit()
        except Exception as e:
            current_app.logger.error(f"Error creating chat room: {e}")
            db.session.rollback()

    return chat
