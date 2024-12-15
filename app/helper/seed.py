import random
from datetime import datetime, timedelta

from sqlalchemy.sql import text

from app import db
from app.enums import NotificationType
from app.models.chat import ChatParticipant, ChatRoom
from app.models.message import Message
from app.models.notification import Notification
from app.models.pin import Pin
from app.models.story import Story
from app.models.user import User
from app.models.serializers import serialize_user, serialize_story, serialize_pin, serialize_chat_room, serialize_chat_participant, serialize_message, serialize_notification, deserialize_user, deserialize_story, deserialize_pin, deserialize_chat_room, deserialize_chat_participant, deserialize_message, deserialize_notification


def seed():
    db.session.execute(
        text(
            "TRUNCATE users, stories, pins, chat_rooms, chat_participants, messages, notifications RESTART IDENTITY CASCADE;"
        )
    )
    db.session.commit()

    users = []
    for i in range(5):
        user = User(
            username=f"user{i}",
            email=f"user{i}@example.com",
            google_id=f"google_id_{i}",
        )
        user.set_password("password")
        users.append(user)
    db.session.add_all(users)
    db.session.commit()

    stories = []
    for i in range(10):
        story = Story(
            content=f"This is the content of story {i}",
            created_at=datetime.now() - timedelta(days=random.randint(1, 30)),
            updated_at=datetime.now(),
            user_id=random.choice(users).id,
            title=f"Story Title {i}",
        )
        stories.append(story)
    db.session.add_all(stories)
    db.session.commit()

    pins = []
    for i, story in enumerate(stories):
        pin = Pin(
            latitude=round(random.uniform(-90, 90), 6),
            longitude=round(random.uniform(-180, 180), 6),
            story_id=story.id,
        )
        pins.append(pin)
    db.session.add_all(pins)
    db.session.commit()

    chat_rooms = []
    for i in range(5):
        chat_room = ChatRoom(
            last_message=f"Last message in chat room {i}",
            unread_message_count=random.randint(0, 10),
            created_at=datetime.now() - timedelta(days=random.randint(1, 30)),
        )
        chat_rooms.append(chat_room)
    db.session.add_all(chat_rooms)
    db.session.commit()

    chat_participants = []
    for chat_room in chat_rooms:
        participants = random.sample(users, k=2)
        for user in participants:
            participant = ChatParticipant(chat_room_id=chat_room.id, user_id=user.id)
            chat_participants.append(participant)
    db.session.add_all(chat_participants)
    db.session.commit()

    messages = []
    for chat_room in chat_rooms:
        for i in range(random.randint(1, 10)):
            message = Message(
                chat_room_id=chat_room.id,
                user_id=random.choice(users).id,
                content=f"Message {i} in chat room {chat_room.id}",
                is_delivered=random.choice([True, False]),
                sent_at=datetime.now() - timedelta(minutes=random.randint(1, 1000)),
            )
            messages.append(message)
    db.session.add_all(messages)
    db.session.commit()

    notifications = []
    for user in users:
        for i in range(random.randint(1, 5)):
            notification = Notification(
                user_id=user.id,
                type=NotificationType.NEW_MESSAGE,
                content=f"Notification {i} for user {user.id}",
                is_read=random.choice([True, False]),
                created_at=datetime.now() - timedelta(minutes=random.randint(1, 1000)),
                reference_id=random.randint(1, 100),  # Replace with actual references if needed
            )
            notifications.append(notification)
    db.session.add_all(notifications)
    db.session.commit()
