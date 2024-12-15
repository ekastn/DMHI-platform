from flask import Blueprint, request
from flask_login import current_user

from app import db
from app.helper.http import create_response
from app.models.chat import ChatRoom, ChatParticipant
from app.models.message import Message
from app.models.notification import Notification
from app.models.serializers import (
    serialize_chat_room,
    serialize_message,
    serialize_notification,
    deserialize_chat_room,
    deserialize_message,
    deserialize_notification,
)

chat = Blueprint("chat", __name__, url_prefix="/api/chat")


@chat.route("/rooms", methods=["GET"])
def get_chat_rooms():
    chat_rooms = ChatRoom.query.all()
    return create_response(
        success=True,
        message="Chat rooms retrieved",
        data={"chat_rooms": [serialize_chat_room(chat_room) for chat_room in chat_rooms]},
    )


@chat.route("/rooms/<int:room_id>", methods=["GET"])
def get_chat_room(room_id):
    chat_room = ChatRoom.query.get(room_id)
    if not chat_room:
        return create_response(success=False, message="Chat room not found", status_code=404)
    return create_response(
        success=True,
        message="Chat room retrieved",
        data={"chat_room": serialize_chat_room(chat_room)},
    )


@chat.route("/rooms", methods=["POST"])
def create_chat_room():
    if not current_user.is_authenticated:
        return create_response(success=False, message="User not authenticated", status_code=401)

    data = request.get_json()
    chat_room = deserialize_chat_room(data)

    try:
        db.session.add(chat_room)
        db.session.commit()
        return create_response(
            success=True,
            message="Chat room created",
            data={"chat_room": serialize_chat_room(chat_room)},
        )
    except Exception as e:
        db.session.rollback()
        return create_response(success=False, message=str(e), status_code=500)


@chat.route("/rooms/<int:room_id>", methods=["PUT"])
def update_chat_room(room_id):
    if not current_user.is_authenticated:
        return create_response(success=False, message="User not authenticated", status_code=401)

    data = request.get_json()
    chat_room = ChatRoom.query.get(room_id)
    if not chat_room:
        return create_response(success=False, message="Chat room not found", status_code=404)

    updated_chat_room = deserialize_chat_room(data)
    chat_room.last_message = updated_chat_room.last_message
    chat_room.unread_message_count = updated_chat_room.unread_message_count

    try:
        db.session.commit()
        return create_response(
            success=True,
            message="Chat room updated",
            data={"chat_room": serialize_chat_room(chat_room)},
        )
    except Exception as e:
        db.session.rollback()
        return create_response(success=False, message=str(e), status_code=500)


@chat.route("/rooms/<int:room_id>", methods=["DELETE"])
def delete_chat_room(room_id):
    if not current_user.is_authenticated:
        return create_response(success=False, message="User not authenticated", status_code=401)

    chat_room = ChatRoom.query.get(room_id)
    if not chat_room:
        return create_response(success=False, message="Chat room not found", status_code=404)

    try:
        db.session.delete(chat_room)
        db.session.commit()
        return create_response(success=True, message="Chat room deleted")
    except Exception as e:
        db.session.rollback()
        return create_response(success=False, message=str(e), status_code=500)


@chat.route("/messages", methods=["POST"])
def send_message():
    if not current_user.is_authenticated:
        return create_response(success=False, message="User not authenticated", status_code=401)

    data = request.get_json()
    message = deserialize_message(data)

    try:
        db.session.add(message)
        db.session.commit()
        return create_response(
            success=True,
            message="Message sent",
            data={"message": serialize_message(message)},
        )
    except Exception as e:
        db.session.rollback()
        return create_response(success=False, message=str(e), status_code=500)


@chat.route("/notifications", methods=["POST"])
def send_notification():
    if not current_user.is_authenticated:
        return create_response(success=False, message="User not authenticated", status_code=401)

    data = request.get_json()
    notification = deserialize_notification(data)

    try:
        db.session.add(notification)
        db.session.commit()
        return create_response(
            success=True,
            message="Notification sent",
            data={"notification": serialize_notification(notification)},
        )
    except Exception as e:
        db.session.rollback()
        return create_response(success=False, message=str(e), status_code=500)
