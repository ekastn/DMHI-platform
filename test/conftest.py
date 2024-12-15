import os
from flask_login import login_user
import pytest

from app import create_app, db
from app.models.user import User
from app.models.story import Story
from app.models.pin import Pin


@pytest.fixture()
def app():
    os.environ["APP_SETTING"] = "config.TestingConfig"
    flask_app = create_app()

    yield flask_app


@pytest.fixture()
def client(app):
    return app.test_client()


@pytest.fixture()
def runner(app):
    return app.test_cli_runner()

@pytest.fixture()
def init_db(app):
    with app.app_context():
        db.create_all()

        default_user = User(username="defTestUser", email="u1@test.com")
        default_user.set_password("userTest1")
        second_user = User(username="secTestUser", email="u2@test.com")
        second_user.set_password("userTest2")
        db.session.add_all([default_user, second_user])

        test_story = Story(tittle="Test Story", content="This is a test story", pin=Pin(latitude=37.7749, longitude=-122.4194), user=default_user)

        db.session.add(test_story)
        db.session.commit()
      
        yield  

        db.drop_all()


@pytest.fixture(scope="module")
def new_user():
    user = User(username="usertest", email="user@test.com")
    user.set_password("test")
    return user

@pytest.fixture(scope="module")
def new_story():
    story = Story(tittle="Test Story", content="This is a test story")
    return story

@pytest.fixture(scope="module")
def new_pin():
    pin = Pin(longitude=10.01 ,latitude=10.01)
    return pin


@pytest.fixture(scope="function")
def log_in_default_user(client):
    client.post(
        "/auth/login",
        data={
            "username": "defTestUser",
            "password": "userTest1",
        },
    )

    yield

    client.get("/auth/logout")


@pytest.fixture(scope="function")
def log_in_second_user(client):
    client.post(
        "/auth/login",
        data={
            "username": "secTestUser",
            "password": "userTest2",
        },
    )

    yield

    client.get("/auth/logout")
