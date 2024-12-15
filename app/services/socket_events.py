import logging
from enum import Enum

from flask_login import current_user
from flask_socketio import SocketIO, emit, join_room, leave_room

from app import db, redis
from app.enums import NotificationType, SocketEventType
from app.models.chat import ChatParticipant
from app.models.message import Message
from app.models.notification import Notification

socketio = SocketIO()


def notification_payload(notification: Notification):
    return {
        "id": notification.id,
        "type": notification.type.value,
        "content": notification.content,
        "isRead": notification.is_read,
        "createdAt": notification.created_at,
    }


def message_payload(message: Message):
    return {
        "id": message.id,
        "chatRoomId": message.chat_room_id,
        "userId": message.user_id,
        "content": message.content,
        "isDelivered": message.is_delivered,
        "sentAt": message.sent_at,
    }


@socketio.on("connect")
def handle_connect():
    print(f"{current_user.username} connected")

    session_id = request.sid
    redis.set(f"user_online:{current_user.id}", session_id)
    join_room(sessio_id)

    notifications = Notification.query.filter_by(user_id=current_user.id, is_read=False).all()

    if not notifications:
        return

    notification_json = [notification_payload(notification) for notification in notifications]
    emit(SocketEventType.NOTIFICATION.value, notification_json, to=session_id)


@socketio.on("disconnect")
def handle_disconnect():
    print(f"{current_user.username} disconnected")
    redis.delete(f"user_online:{current_user.id}")
    leave_room(request.sid)


@socketio.on(SocketEventType.ENTER_CHAT_ROOM.value)
def handle_enter_chat_room(data):
    chat_room_id = data["chatRoomId"]

    redis.sadd(f"chat_room:{chat_room_id}", current_user.id)
    join_room(chat_room_id)

    messages = Message.query.filter_by(chat_room_id=chat_room_id).all()

    for message in messages:
        if message.user_id != current_user.id:
            message.is_delivered = True

    db.session.commit()

    message_json = [message_payload(message) for message in messages]
    emit(SocketEventType.LOAD_MESSAGES.value, message_json, to=chat_room_id)


@socketio.on(SocketEventType.LEAVE_CHAT_ROOM.value)
def handle_leave_chat_room(data):
    chat_room_id = data["chatRoomId"]
    redis.srem(f"chat_room:{chat_room_id}", current_user.id)
    leave_room(chat_room_id)


@socketio.on(SocketEventType.SEND_MESSAGE.value)
def handle_send_message(data):
    chat_room_id = data["chatRoomId"]
    content = data["content"]

    message = Message(chat_room_id=chat_room_id, user_id=current_user.id, content=content)
    db.session.add(message)
    db.session.commit()

    recipient_id = (
        ChatParticipant.query.filter(
            ChatParticipant.chat_room_id == chat_room_id, ChatParticipant.user_id != current_user.id
        )
        .first()
        .user_id
    )

    recipient_online = redis.get(f"user_online:{recipient_id}")
    recipient_in_chat_room = redis.sismember(f"chat_room:{chat_room_id}", recipient_id)

    if recipient_online:
        if recipient_in_chat_room:
            emit(SocketEventType.NEW_MESSAGE.value, message_payload(message), to=chat_room_id)
            message.is_delivered = True
            db.session.commit()
        else:
            notification = Notification(
                user_id=recipient_id,
                type=NotificationType.NEW_MESSAGE,
                content=f"New message from {current_user.username}",
            )
            db.session.add(notification)
            db.session.commit()

            emit(SocketEventType.NOTIFICATION.value, notification_payload(notification), to=recipient_online)
    else:
        notification = Notification(
            user_id=recipient_id,
            type=NotificationType.NEW_MESSAGE,
            content=f"New message from {current_user.username}",
        )
        db.session.add(notification)
        db.session.commit()
