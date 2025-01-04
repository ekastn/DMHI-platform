from app.models.message import Message
from datetime import datetime

def test_create_message():
    message = Message(chat_room_id=1, user_id=1, content="Hello, World!", is_delivered=True, sent_at=datetime.now())
    assert message.chat_room_id == 1
    assert message.user_id == 1
    assert message.content == "Hello, World!"
    assert message.is_delivered is True
    assert message.sent_at is not None
    assert message.__repr__() == f"<Message: id={message.id}, user={message.user_id}, content={message.content[:20]}...)>"

def test_message_relationships():
    message = Message(chat_room_id=1, user_id=1, content="Hello, World!")
    assert message.chat_room_id == 1
    assert message.user_id == 1
