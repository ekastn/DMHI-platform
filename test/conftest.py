import os

import pytest

from app import create_app, db
from app.models.user import User


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
        db.session.add(default_user)
        db.session.add(second_user)

        db.session.commit()

        yield  # this is where the testing happens!

        db.drop_all()


@pytest.fixture(scope="module")
def new_user():
    user = User(username="usertest", email="user@test.com")
    user.set_password("test")
    return user


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
