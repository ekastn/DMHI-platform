from flask import Blueprint, request
from flask.json import jsonify
from flask_login import current_user

from app.helper.http import create_response
from app.services.chat_services import get_chat_rooms, get_or_create_chat_room

chat = Blueprint("chat", __name__, url_prefix="/api/chats")


@chat.route("/", methods=["GET"])
def list_user_chats():
    if not current_user.is_authenticated:
        return create_response(success=False, message="User not authenticated", status_code=401)

    user_id = current_user.id
    chats = get_chat_rooms(user_id)
    return create_response(success=True, message="Chats fetched successfully", data={"chatRooms": chats})


@chat.route("/", methods=["PATCH"])
def get_or_create_chat():
    if not current_user.is_authenticated:
        return create_response(success=False, message="User not authenticated", status_code=401)

    data = request.get_json()
    recipient_id = data.get("recipientId")
    chat = get_or_create_chat_room(current_user.id, recipient_id)
    return create_response(success=True, message="Chat fetched successfully", data={"chatRoomId": chat.id})
