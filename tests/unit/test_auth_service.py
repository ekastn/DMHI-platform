from unittest.mock import patch

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


def test_google_login(client, init_db):
    response = client.get("/auth/google")
    assert response.status_code == 302  # Redirect to Google login


def test_google_callback(client, init_db):
    with (
        patch("app.services.auth.google.authorize_access_token") as mock_token,
        patch("app.services.auth.google.get") as mock_get,
    ):
        mock_token.return_value = {"access_token": "test_token"}
        mock_get.return_value.json.return_value = {"email": "test@example.com", "sub": "test_google_id"}
        response = client.get("/auth/google_callback")
        assert response.status_code == 302  # Redirect to main page
