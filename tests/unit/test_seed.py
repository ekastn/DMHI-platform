from datetime import datetime
from unittest.mock import patch

import pytest

from app import db
from app.helper.seed import seed
from app.models.chat import ChatParticipant, ChatRoom
from app.models.friend import Friend, FriendRequest
from app.models.message import Message
from app.models.notification import Notification
from app.models.pin import Pin
from app.models.story import Story
from app.models.user import User


@pytest.fixture
def clean_db(app):
    with app.app_context():
        db.drop_all()
        db.create_all()
        yield
        db.drop_all()


def test_seed_function(clean_db, app):
    with app.app_context():
        # Execute seed function
        seed()

        # Test Users
        users = User.query.all()
        # assert len(users) == 5  # Check if all 5 users were created
        for user in users:
            assert user.username in ["john_doe", "jane_smith", "bob_wilson", "alice_brown", "mike_jones"]
            assert user.email == f"{user.username}@example.com"
            assert user.google_id is not None
            assert user.password_hash is not None
            assert user.created_at is not None

        # Test Friends
        friends = Friend.query.all()
        assert len(friends) == 3  # Check if 3 friend relationships were created
        for friend in friends:
            assert isinstance(friend.usera_id, int)
            assert isinstance(friend.userb_id, int)
            assert friend.created_at is not None

        # Test Friend Requests
        friend_requests = FriendRequest.query.all()
        assert len(friend_requests) == 2  # Check if 2 friend requests were created
        for request in friend_requests:
            assert isinstance(request.sender_id, int)
            assert isinstance(request.receiver_id, int)
            assert request.sent_at is not None

        # Test Stories
        stories = Story.query.all()
        assert len(stories) == 5  # Check if 5 stories were created
        story_titles = [
            "My Adventure in Paris",
            "Hiking the Grand Canyon",
            "Beach Day in Bali",
            "Tokyo Street Food Tour",
            "New York City Lights",
        ]
        for story in stories:
            assert story.title in story_titles
            assert story.content is not None
            assert story.created_at is not None
            assert story.updated_at is not None
            assert isinstance(story.user_id, int)

        # Test Pins
        pins = Pin.query.all()
        assert len(pins) == 5  # Check if 5 pins were created
        locations = [
            (48.8566, 2.3522),  # Paris
            (36.0544, -112.1401),  # Grand Canyon
            (-8.3405, 115.0920),  # Bali
            (35.6762, 139.6503),  # Tokyo
            (40.7128, -74.0060),  # New York
        ]
        for pin in pins:
            assert (pin.latitude, pin.longitude) in locations
            assert isinstance(pin.story_id, int)

        # Test Chat Rooms
        chat_rooms = ChatRoom.query.all()
        assert len(chat_rooms) == 3  # Check if 3 chat rooms were created
        for chat_room in chat_rooms:
            assert chat_room.last_message is not None
            assert chat_room.created_at is not None

        # Test Chat Participants
        chat_participants = ChatParticipant.query.all()
        assert len(chat_participants) == 6  # Check if 6 participants were created (2 per chat room)
        for participant in chat_participants:
            assert isinstance(participant.chat_room_id, int)
            assert isinstance(participant.user_id, int)

        # Test Messages
        messages = Message.query.all()
        assert len(messages) > 0  # Check if messages were created
        message_contents = [
            "Hey, how are you?",
            "What's up?",
            "Did you see that new movie?",
            "Let's meet up tomorrow!",
            "Great to hear from you!",
        ]
        for message in messages:
            assert message.content in message_contents
            assert isinstance(message.chat_room_id, int)
            assert isinstance(message.user_id, int)
            assert isinstance(message.is_delivered, bool)
            assert isinstance(message.sent_at, datetime)

        # Test Notifications
        notifications = Notification.query.all()
        assert len(notifications) > 0  # Check if notifications were created
        notification_contents = [
            "You have a new message",
            "Someone liked your story",
            "New friend request",
            "Your friend posted a new story",
        ]
        for notification in notifications:
            assert notification.content in notification_contents
            assert isinstance(notification.user_id, int)
            assert notification.type is not None
            assert isinstance(notification.is_read, bool)
            assert isinstance(notification.created_at, datetime)
            assert isinstance(notification.reference_id, int)


def test_seed_function_with_error(clean_db, app):
    with app.app_context():
        # Test database error handling
        with patch("app.helper.seed.db.session.commit") as mock_commit:
            mock_commit.side_effect = Exception("Database error")
            with pytest.raises(Exception):
                seed()
