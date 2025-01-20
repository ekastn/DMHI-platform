from app.models.chat import ChatRoom
from app.models.user import User
from app.services.chat_services import get_chat_rooms, get_or_create_chat_room, get_unread_message_count


def test_get_chat_rooms(init_db):
    user = User.query.filter_by(username="defTestUser").first()
    chat_rooms = get_chat_rooms(user.id)
    assert len(chat_rooms) > 0
    assert "id" in chat_rooms[0]
    assert "lastMessage" in chat_rooms[0]
    assert "unreadCount" in chat_rooms[0]
    assert "user" in chat_rooms[0]
    assert "lastMessageTimestamp" in chat_rooms[0]


def test_get_or_create_chat_room(init_db):
    user1 = User.query.filter_by(username="defTestUser").first()
    user2 = User.query.filter_by(username="secTestUser").first()
    chat_room = get_or_create_chat_room(user1.id, user2.id)
    assert chat_room is not None
    assert isinstance(chat_room, ChatRoom)
    assert len(chat_room.users) == 2
    assert chat_room.users[0].user_id in [user1.id, user2.id]
    assert chat_room.users[1].user_id in [user1.id, user2.id]
