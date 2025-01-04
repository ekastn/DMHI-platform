from app.models.user import User
from app.services.auth import authenticate_user


def test_authenticate_user_success(init_db):
    user = User.query.filter_by(username="defTestUser").first()
    authenticated = authenticate_user("defTestUser", "userTest1")
    assert authenticated is not None
    assert authenticated.id == user.id


def test_authenticate_user_wrong_password(init_db):
    authenticated = authenticate_user("defTestUser", "wrongpassword")
    assert authenticated is None


def test_authenticate_user_nonexistent(init_db):
    authenticated = authenticate_user("nonexistent", "password")
    assert authenticated is None
