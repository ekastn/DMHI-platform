import json


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
        data=json.dumps({"username": "HumanNoid", "password": "HumanIsGood"}),
        content_type="application/json",
    )
    assert response.status_code == 201
    assert b"Welcome HumanNoid!" in response.data
    assert b"username" in response.data


def test_duplicate_user_registration(client, init_db):
    client.post(
        "/auth/register",
        data=json.dumps({"username": "newuser", "password": "newuser"}),
        content_type="application/json",
    )
    client.get("/auth/logout")

    response = client.post(
        "/auth/register",
        data=json.dumps({"username": "newuser", "password": "newuser"}),
        content_type="application/json",
    )
    assert response.status_code != 201
    assert b"Username already taken" in response.data
