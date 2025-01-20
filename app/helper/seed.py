import random
from datetime import datetime, timedelta

from sqlalchemy.sql import text

from app import db
from app.enums import NotificationType
from app.models.chat import ChatParticipant, ChatRoom
from app.models.friend import Friend, FriendRequest, FriendRequestStatusType
from app.models.message import Message
from app.models.notification import Notification
from app.models.pin import Pin
from app.models.story import Story
from app.models.user import User


def seed():
    db.session.execute(
        text(
            """TRUNCATE users, stories, pins, chat_rooms, chat_participants,
            messages, notifications, friends, friend_requests RESTART IDENTITY CASCADE;"""
        )
    )
    db.session.commit()

    try:
        # Create users
        users = []
        usernames = ["john_doe", "jane_smith", "bob_wilson", "alice_brown", "mike_jones"]
        for i, username in enumerate(usernames):
            user = User(
                username=username,
                email=f"{username}@example.com",
                google_id=f"google_id_{i}",
                created_at=datetime.now() - timedelta(days=random.randint(1, 365)),
            )
            user.set_password("Password123")
            users.append(user)
        db.session.add_all(users)
        db.session.commit()
    except Exception as e:
        print(e)
        db.session.rollback()

    try:
        # Create friend relationships
        friends = []
        for i in range(3):  # Create some friend connections
            user1, user2 = random.sample(users, 2)
            if user1.id < user2.id:  # Ensure consistent ordering
                friend = Friend(usera_id=user1.id, userb_id=user2.id)
            else:
                friend = Friend(usera_id=user2.id, userb_id=user1.id)
            friends.append(friend)
        db.session.add_all(friends)
        db.session.commit()
    except Exception as e:
        print(e)
        db.session.rollback()

    try:
        # Create friend requests
        friend_requests = []
        for i in range(2):  # Create some pending friend requests
            sender, receiver = random.sample(users, 2)
            friend_request = FriendRequest(
                sender_id=sender.id,
                receiver_id=receiver.id,
                status=FriendRequestStatusType.PENDING,
                sent_at=datetime.now() - timedelta(days=random.randint(1, 30)),
            )
            friend_requests.append(friend_request)
        db.session.add_all(friend_requests)
        db.session.commit()
    except Exception as e:
        print(e)
        db.session.rollback()

    try:
        # Create stories
        stories = []
        story_titles = [
            "My Adventure in Paris",
            "Hiking the Grand Canyon",
            "Beach Day in Bali",
            "Tokyo Street Food Tour",
            "New York City Lights",
        ]
        story_contents = [
            "Explored the beautiful streets of Paris...",
            "An amazing day hiking through the canyon...",
            "Relaxing on the pristine beaches of Bali...",
            "Trying delicious street food in Tokyo...",
            "The city that never sleeps...",
        ]
        for i in range(len(story_titles)):
            story = Story(
                title=story_titles[i],
                content=story_contents[i],
                created_at=datetime.now() - timedelta(days=random.randint(1, 30)),
                updated_at=datetime.now(),
                user_id=random.choice(users).id,
            )
            stories.append(story)
        db.session.add_all(stories)
        db.session.commit()
    except Exception as e:
        print(e)
        db.session.rollback()

    try:
        # Create pins for stories
        pins = []
        locations = [
            (48.8566, 2.3522),  # Paris
            (36.0544, -112.1401),  # Grand Canyon
            (-8.3405, 115.0920),  # Bali
            (35.6762, 139.6503),  # Tokyo
            (40.7128, -74.0060),  # New York
        ]
        for i, story in enumerate(stories):
            lat, lng = locations[i]
            pin = Pin(
                latitude=lat,
                longitude=lng,
                story_id=story.id,
            )
            pins.append(pin)
        db.session.add_all(pins)
        db.session.commit()
    except Exception as e:
        print(e)
        db.session.rollback()

    try:
        # Create chat rooms and messages
        chat_rooms = []
        for i in range(3):
            chat_room = ChatRoom(
                last_message=f"Last message in chat room {i}",
                created_at=datetime.now() - timedelta(days=random.randint(1, 30)),
            )
            chat_rooms.append(chat_room)
        db.session.add_all(chat_rooms)
        db.session.commit()
    except Exception as e:
        print(e)
        db.session.rollback()

    try:
        # Create chat participants
        chat_participants = []
        for chat_room in chat_rooms:
            participants = random.sample(users, k=2)
            for user in participants:
                participant = ChatParticipant(chat_room_id=chat_room.id, user_id=user.id)
                chat_participants.append(participant)
        db.session.add_all(chat_participants)
        db.session.commit()
    except Exception as e:
        print(e)
        db.session.rollback()

    try:
        # Create messages
        messages = []
        message_contents = [
            "Hey, how are you?",
            "What's up?",
            "Did you see that new movie?",
            "Let's meet up tomorrow!",
            "Great to hear from you!",
        ]
        for chat_room in chat_rooms:
            for i in range(random.randint(3, 7)):
                message = Message(
                    chat_room_id=chat_room.id,
                    user_id=random.choice([p.user_id for p in chat_room.users]),
                    content=random.choice(message_contents),
                    is_delivered=random.choice([True, False]),
                    sent_at=datetime.now() - timedelta(minutes=random.randint(1, 1000)),
                )
                messages.append(message)
        db.session.add_all(messages)
        db.session.commit()
    except Exception as e:
        print(e)
        db.session.rollback()

    try:
        # Create notifications
        notifications = []
        notification_contents = [
            "You have a new message",
            "Someone liked your story",
            "New friend request",
            "Your friend posted a new story",
        ]
        for user in users:
            for i in range(random.randint(1, 3)):
                notification = Notification(
                    user_id=user.id,
                    type=random.choice(list(NotificationType)),
                    content=random.choice(notification_contents),
                    is_read=random.choice([True, False]),
                    created_at=datetime.now() - timedelta(minutes=random.randint(1, 1000)),
                    reference_id=random.randint(1, 100),
                )
                notifications.append(notification)
        db.session.add_all(notifications)
        db.session.commit()
    except Exception as e:
        print(e)
        db.session.rollback()

    print("Database seeded successfully!")
