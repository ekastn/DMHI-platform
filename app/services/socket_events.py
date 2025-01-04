from flask import current_app, request
from flask_login import current_user
from flask_socketio import SocketIO, emit, join_room, leave_room

from app import db
from app.enums import NotificationType, SocketEventType
from app.helper.http import notification_payload
from app.models.chat import ChatParticipant
from app.models.message import Message
from app.models.notification import Notification
from app.services.redis_services import (
    add_user_to_chat_room,
    delete_user_online,
    get_user_online,
    is_user_in_chat_room,
    remove_user_from_chat_room,
    set_user_online,
)

socketio = SocketIO()


@socketio.on("connect")
def handle_connect():
    current_app.logger.info(f"{current_user.username} connected")

    session_id = request.sid

    set_user_online(current_user.id, session_id)
    join_room(session_id)

    notifications = Notification.query.filter_by(user_id=current_user.id, is_read=False).all()

    if not notifications:
        return

    notification_data = [notification_payload(notification) for notification in notifications]

    emit(SocketEventType.LOAD_NOTIFICATION.value, notification_data, to=session_id)


@socketio.on("disconnect")
def handle_disconnect():
    current_app.logger.info(f"{current_user.username} disconnected")
    delete_user_online(current_user.id)
    leave_room(request.sid)


@socketio.on(SocketEventType.ENTER_CHAT_ROOM.value)
def handle_enter_chat_room(data):
    chat_room_id = data["chatRoomId"]

    add_user_to_chat_room(chat_room_id, current_user.id)
    join_room(chat_room_id)

    recipient = (
        ChatParticipant.query.filter(
            ChatParticipant.chat_room_id == chat_room_id,
            ChatParticipant.user_id != current_user.id,
        ).first()
    ).user

    messages = Message.query.filter_by(chat_room_id=chat_room_id).order_by(Message.sent_at).all()
    for message in messages:
        if message.user_id == recipient.id and not message.is_delivered:
            message.is_delivered = True

    db.session.commit()

    message_data = [
        {
            "id": message.id,
            "chatRoomId": message.chat_room_id,
            "content": message.content,
            "userId": message.user_id,
            "sentAt": message.sent_at.isoformat(),
        }
        for message in messages
    ]

    chat_room_data = {
        "chatRoomId": chat_room_id,
        "messages": message_data,
        "recipient": {
            "id": recipient.id,
            "username": recipient.username,
        },
    }

    emit(SocketEventType.LOAD_CHAT_ROOM.value, chat_room_data, to=request.sid)


@socketio.on(SocketEventType.LEAVE_CHAT_ROOM.value)
def handle_leave_chat_room(data):
    chat_room_id = data["chatRoomId"]
    remove_user_from_chat_room(chat_room_id, current_user.id)
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
            ChatParticipant.chat_room_id == chat_room_id,
            ChatParticipant.user_id != current_user.id,
        )
        .first()
        .user_id
    )

    recipient_online = get_user_online(recipient_id)
    recipient_in_chat_room = is_user_in_chat_room(chat_room_id, recipient_id)

    message_data = {
        "id": message.id,
        "chatRoomId": message.chat_room_id,
        "content": message.content,
        "userId": message.user_id,
        "sentAt": message.sent_at.isoformat(),
    }

    if recipient_online:
        if recipient_in_chat_room:
            emit(
                SocketEventType.NEW_MESSAGE.value,
                message_data,
                to=chat_room_id,
            )
            message.is_delivered = True
            db.session.commit()
        else:
            notification = Notification(
                user_id=recipient_id,
                type=NotificationType.NEW_MESSAGE,
                content=f"New message from {current_user.username}",
                reference_id=chat_room_id,
            )
            emit(
                SocketEventType.NEW_MESSAGE.value,
                message_data,
                to=request.sid,
            )
            try:
                db.session.add(notification)
                db.session.commit()
                emit(
                    SocketEventType.NEW_NOTIFICATION.value,
                    notification_payload(notificaiton),
                    to=recipient_online.decode("utf-8"),
                )
                current_app.logger.info(f"Notification sent to {notification.user.username}")
            except Exception as e:
                current_app.logger.error(e)

    else:
        emit(
            SocketEventType.NEW_MESSAGE.value,
            message_data,
            to=request.sid,
        )
        notification = Notification(
            user_id=recipient_id,
            type=NotificationType.NEW_MESSAGE,
            content=f"New message from {current_user.username}",
            reference_id=chat_room_id,
        )
        db.session.add(notification)
        db.session.commit()
