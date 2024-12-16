from datetime import datetime

from app.models.chat import ChatParticipant, ChatRoom


def test_create_chat_room():
    chat_room = ChatRoom(last_message="Hello", created_at=datetime.now())
    assert chat_room.last_message == "Hello"
    assert chat_room.created_at is not None
    assert chat_room.__repr__() == f"<ChatRoom: {chat_room.id}>"


def test_chat_room_relationships():
    chat_room = ChatRoom()
    user = ChatParticipant(chat_room_id=chat_room.id, user_id=1)
    chat_room.users.append(user)
    assert len(chat_room.users) == 1
    assert chat_room.users[0].user_id == 1
    assert chat_room.users[0].chat_room_id == chat_room.id


def test_create_chat_participant():
    chat_participant = ChatParticipant(chat_room_id=1, user_id=1)
    assert chat_participant.chat_room_id == 1
    assert chat_participant.user_id == 1
    assert (
        chat_participant.__repr__()
        == f"<ChatParticipant: ChatRoom={chat_participant.chat_room_id}, User={chat_participant.user}>"
    )


def test_chat_participant_relationships():
    chat_participant = ChatParticipant(chat_room_id=1, user_id=1)
    assert chat_participant.chat_room_id == 1
    assert chat_participant.user_id == 1
