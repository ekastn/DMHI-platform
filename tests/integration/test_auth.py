import json
from unittest.mock import patch


def test_valid_login_logout(client, init_db):
    response = client.post(
        "/auth/login",
        data=json.dumps({"username": "defTestUser", "password": "userTest1"}),
        content_type="application/json",
    )
    assert response.status_code == 200
    assert b"success" in response.data
    assert b"user" in response.data
    assert b"defTestUser" in response.data
    assert b"Welcome Back!" in response.data

    response = client.get("/auth/logout", follow_redirects=True)
    assert response.status_code == 200
    assert b"null" in response.data
    assert b"Goodbye!" in response.data


def test_invalid_login(client, init_db):
    response = client.post(
        "/auth/login",
        data=json.dumps({"username": "randomUser", "password": "random"}),
        content_type="application/json",
    )
    assert response.status_code == 404
    assert b"Invalid username or password" in response.data


def test_valid_registration(client, init_db):
    response = client.post(
        "/auth/register",
        data=json.dumps({"username": "HumanNoid", "password": "HumanIsGood1"}),
        content_type="application/json",
    )
    assert response.status_code == 201
    assert b"Welcome HumanNoid!" in response.data
    assert b"username" in response.data


def test_duplicate_user_registration(client, init_db):
    client.post(
        "/auth/register",
        data=json.dumps({"username": "newuser", "password": "Newuser1"}),
        content_type="application/json",
    )
    client.get("/auth/logout")

    response = client.post(
        "/auth/register",
        data=json.dumps({"username": "newuser", "password": "Newuser1"}),
        content_type="application/json",
    )
    assert response.status_code != 201
    assert b"Username already taken" in response.data


def test_user_info_authenticated(client, init_db, log_in_default_user):
    response = client.get("/auth/me")
    assert response.status_code == 200
    assert b"User authenticated" in response.data
    assert b"defTestUser" in response.data


def test_user_info_not_authenticated(client, init_db):
    response = client.get("/auth/me")
    assert response.status_code == 200
    assert b"User not authenticated" in response.data


def test_google_login(client, init_db):
    response = client.get("/auth/google")
    assert response.status_code == 302  # Redirect to Google login


def test_google_callback(client, init_db):
    # Mock the Google OAuth response
    with (
        patch("app.services.auth.google.authorize_access_token") as mock_token,
        patch("app.services.auth.google.get") as mock_get,
    ):
        mock_token.return_value = {"access_token": "test_token"}
        mock_get.return_value.json.return_value = {"email": "test@example.com", "sub": "test_google_id"}
        response = client.get("/auth/google_callback")
        assert response.status_code == 302  # Redirect to main page
