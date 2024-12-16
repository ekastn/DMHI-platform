from app import db
from app.models.chat import ChatRoom
from app.models.message import Message


def test_last_message_chat_room(init_db):
    chat_room = ChatRoom()
    db.session.add(chat_room)
    db.session.commit()

    message = Message(chat_room_id=chat_room.id, user_id=1, content="Hello!", is_delivered=False)
    db.session.add(message)
    db.session.commit()

    updated_chat_room = ChatRoom.query.get(chat_room.id)
    assert updated_chat_room.last_message == "Hello!"

    message = Message(chat_room_id=chat_room.id, user_id=1, content="hai!", is_delivered=False)
    db.session.add(message)
    db.session.commit()

    updated_chat_room = ChatRoom.query.get(chat_room.id)
    assert updated_chat_room.last_message == "hai!"


def test_last_messate_timetamp(init_db):
    chat_room = ChatRoom()
    db.session.add(chat_room)
    db.session.commit()

    message = Message(chat_room_id=chat_room.id, user_id=1, content="Hello!", is_delivered=False)
    db.session.add(message)
    db.session.commit()

    updated_chat_room = ChatRoom.query.get(chat_room.id)
    assert updated_chat_room.last_message_timestamp == message.sent_at

    message = Message(chat_room_id=chat_room.id, user_id=1, content="hai!", is_delivered=False)
    db.session.add(message)
    db.session.commit()

    updated_chat_room = ChatRoom.query.get(chat_room.id)
    assert updated_chat_room.last_message_timestamp == message.sent_at
