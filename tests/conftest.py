import io
import os
from datetime import datetime
from unittest.mock import Mock

import pytest
from flask_socketio import SocketIO
from flask_login import FlaskLoginClient
from PIL import Image

from app import create_app, db
from app.enums import FriendRequestStatusType, NotificationType
from app.helper.trigger import create_triggers_and_functions, drop_triggers_and_functions
from app.models.chat import ChatParticipant, ChatRoom
from app.models.friend import Friend, FriendRequest
from app.models.message import Message
from app.models.notification import Notification
from app.models.pin import Pin
from app.models.story import Story
from app.models.user import User


@pytest.fixture()
def app():
    os.environ["APP_SETTING"] = "config.TestingConfig"
    flask_app = create_app()
    flask_app.test_client_class = FlaskLoginClient
    yield flask_app


@pytest.fixture()
def client(app):
    return app.test_client()


@pytest.fixture(scope="function")
def auth_client(app, init_db):
    user = User.query.get(1)
    with app.test_client(user=user) as client:
        yield client


@pytest.fixture()
def runner(app):
    return app.test_cli_runner()


@pytest.fixture()
def socketio_client(app):
    socket = SocketIO(app)
    socket_client = socket.test_client(app)
    return socket_client


@pytest.fixture(scope="function")
def init_db(app):
    with app.app_context():
        db.create_all()

        default_user = User(username="defTestUser", email="u1@test.com")
        default_user.set_password("userTest1")
        db.session.add(default_user)

        second_user = User(username="secTestUser", email="u2@test.com")
        second_user.set_password("userTest2")
        db.session.add(second_user)
        db.session.commit()

        test_story = Story(
            title="Test Story",
            content="This is a test story",
            pin=Pin(latitude=37.7749, longitude=-122.4194),
            user=default_user,
        )
        db.session.add(test_story)
        db.session.commit()

        chat_room = ChatRoom(last_message="Test message", last_message_timestamp=datetime.now())
        db.session.add(chat_room)
        db.session.commit()

        participant1 = ChatParticipant(chat_room_id=chat_room.id, user_id=default_user.id)
        participant2 = ChatParticipant(chat_room_id=chat_room.id, user_id=second_user.id)
        db.session.add_all([participant1, participant2])
        db.session.commit()

        message = Message(
            chat_room_id=chat_room.id,
            user_id=default_user.id,
            content="Hello!",
            is_delivered=False,
            sent_at=datetime.now(),
        )
        db.session.add(message)
        db.session.commit()

        notification = Notification(
            user_id=second_user.id,
            type=NotificationType.NEW_MESSAGE,
            content="You have a new message",
            is_read=False,
            created_at=datetime.now(),
            reference_id=chat_room.id,
        )
        db.session.add(notification)
        db.session.commit()

        create_triggers_and_functions()

        yield

        drop_triggers_and_functions()
        db.drop_all()


@pytest.fixture(scope="function")
def mock_current_user():
    return Mock(id=1, username="defTestUser")


@pytest.fixture(scope="module")
def new_user():
    user = User(username="usertest", email="user@test.com", created_at=datetime.now(), updated_at=datetime.now())
    user.set_password("test")
    return user


@pytest.fixture(scope="module")
def new_story():
    story = Story(
        title="Test Story", content="This is a test story", created_at=datetime.now(), updated_at=datetime.now()
    )
    return story


@pytest.fixture(scope="module")
def new_pin():
    pin = Pin(longitude=10.01, latitude=10.01)
    return pin


@pytest.fixture(scope="function")
def test_image():
    file = io.BytesIO()
    image = Image.new("RGB", (800, 600), color="red")
    image.save(file, "JPEG")
    file.seek(0)
    return file


@pytest.fixture(scope="function")
def log_in_default_user(client):
    response = client.post(
        "/auth/login",
        json={
            "username": "defTestUser",
            "password": "userTest1",
        },
    )
    assert response.status_code == 200
    yield
    client.get("/auth/logout")


@pytest.fixture(scope="function")
def log_in_second_user(client):
    response = client.post(
        "/auth/login",
        json={
            "username": "secTestUser",
            "password": "userTest2",
        },
    )
    assert response.status_code == 200
    yield
    client.get("/auth/logout")


@pytest.fixture(scope="function")
def mock_socket_request():
    class MockRequest:
        def __init__(self):
            self.sid = "test_socket_id"

    return MockRequest()


@pytest.fixture(scope="function")
def mock_storage():
    class MockStorage:
        def create_file(self, *args, **kwargs):
            return {"$id": "test_file_id"}

        def delete_file(self, *args, **kwargs):
            return True

    return MockStorage()


@pytest.fixture(scope="function")
def mock_redis():
    class MockRedis:
        def __init__(self):
            self.data = {}

        def set(self, key, value):
            self.data[key] = value

        def get(self, key):
            return self.data.get(key)

        def delete(self, key):
            if key in self.data:
                del self.data[key]

        def sadd(self, key, value):
            if key not in self.data:
                self.data[key] = set()
            self.data[key].add(value)

        def srem(self, key, value):
            if key in self.data:
                self.data[key].remove(value)

        def sismember(self, key, value):
            return key in self.data and value in self.data[key]

    return MockRedis()
