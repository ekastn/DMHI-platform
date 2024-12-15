import unittest
from datetime import datetime

from app.models.chat import ChatRoom, ChatParticipant
from app.models.message import Message
from app.models.notification import Notification
from app.models.pin import Pin
from app.models.story import Story
from app.models.user import User
from app.models.serializers import (
    serialize_chat_room,
    deserialize_chat_room,
    serialize_chat_participant,
    deserialize_chat_participant,
    serialize_message,
    deserialize_message,
    serialize_notification,
    deserialize_notification,
    serialize_pin,
    deserialize_pin,
    serialize_story,
    deserialize_story,
    serialize_user,
    deserialize_user,
)


class TestSerializers(unittest.TestCase):
    def test_serialize_deserialize_chat_room(self):
        chat_room = ChatRoom(
            id=1,
            last_message="Hello",
            unread_message_count=2,
            created_at=datetime.now(),
            users=[],
            messages=[],
        )
        serialized = serialize_chat_room(chat_room)
        deserialized = deserialize_chat_room(serialized)
        self.assertEqual(chat_room.id, deserialized.id)
        self.assertEqual(chat_room.last_message, deserialized.last_message)
        self.assertEqual(chat_room.unread_message_count, deserialized.unread_message_count)

    def test_serialize_deserialize_chat_participant(self):
        chat_participant = ChatParticipant(chat_room_id=1, user_id=1)
        serialized = serialize_chat_participant(chat_participant)
        deserialized = deserialize_chat_participant(serialized)
        self.assertEqual(chat_participant.chat_room_id, deserialized.chat_room_id)
        self.assertEqual(chat_participant.user_id, deserialized.user_id)

    def test_serialize_deserialize_message(self):
        message = Message(
            id=1,
            chat_room_id=1,
            user_id=1,
            content="Hello",
            is_delivered=True,
            sent_at=datetime.now(),
        )
        serialized = serialize_message(message)
        deserialized = deserialize_message(serialized)
        self.assertEqual(message.id, deserialized.id)
        self.assertEqual(message.chat_room_id, deserialized.chat_room_id)
        self.assertEqual(message.user_id, deserialized.user_id)
        self.assertEqual(message.content, deserialized.content)
        self.assertEqual(message.is_delivered, deserialized.is_delivered)

    def test_serialize_deserialize_notification(self):
        notification = Notification(
            id=1,
            user_id=1,
            type="new_message",
            content="You have a new message",
            is_read=False,
            created_at=datetime.now(),
            reference_id=1,
        )
        serialized = serialize_notification(notification)
        deserialized = deserialize_notification(serialized)
        self.assertEqual(notification.id, deserialized.id)
        self.assertEqual(notification.user_id, deserialized.user_id)
        self.assertEqual(notification.type, deserialized.type)
        self.assertEqual(notification.content, deserialized.content)
        self.assertEqual(notification.is_read, deserialized.is_read)

    def test_serialize_deserialize_pin(self):
        pin = Pin(id=1, latitude=12.34, longitude=56.78, story_id=1)
        serialized = serialize_pin(pin)
        deserialized = deserialize_pin(serialized)
        self.assertEqual(pin.id, deserialized.id)
        self.assertEqual(pin.latitude, deserialized.latitude)
        self.assertEqual(pin.longitude, deserialized.longitude)
        self.assertEqual(pin.story_id, deserialized.story_id)

    def test_serialize_deserialize_story(self):
        story = Story(
            id=1,
            title="Title",
            content="Content",
            created_at=datetime.now(),
            updated_at=datetime.now(),
            user_id=1,
            pin=Pin(id=1, latitude=12.34, longitude=56.78, story_id=1),
        )
        serialized = serialize_story(story)
        deserialized = deserialize_story(serialized)
        self.assertEqual(story.id, deserialized.id)
        self.assertEqual(story.title, deserialized.title)
        self.assertEqual(story.content, deserialized.content)
        self.assertEqual(story.user_id, deserialized.user_id)

    def test_serialize_deserialize_user(self):
        user = User(
            id=1,
            username="username",
            email="email@example.com",
            password_hash="hash",
            google_id="google_id",
            stories=[],
            chat_rooms=[],
            messages=[],
            notifications=[],
        )
        serialized = serialize_user(user)
        deserialized = deserialize_user(serialized)
        self.assertEqual(user.id, deserialized.id)
        self.assertEqual(user.username, deserialized.username)
        self.assertEqual(user.email, deserialized.email)
        self.assertEqual(user.password_hash, deserialized.password_hash)
        self.assertEqual(user.google_id, deserialized.google_id)


if __name__ == "__main__":
    unittest.main()
