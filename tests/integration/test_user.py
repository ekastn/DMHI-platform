import json


def test_get_user_info(client, init_db, log_in_default_user):
    response = client.get("/api/user/1")
    assert response.status_code == 200
    assert b"success" in response.data
    assert b"user" in response.data
    assert b"defTestUser" in response.data


def test_get_user_info_not_found(client, init_db, log_in_default_user):
    response = client.get("/api/user/999")
    assert response.status_code == 404
    assert b"User not found" in response.data


def test_get_user_friends(client, init_db, log_in_default_user):
    response = client.get("/api/user/1/friends")
    assert response.status_code == 200
    assert b"success" in response.data
    assert b"friends" in response.data


def test_get_user_stories(client, init_db, log_in_default_user):
    response = client.get("/api/user/1/stories")
    assert response.status_code == 200
    assert b"success" in response.data
    assert b"stories" in response.data


def test_is_friend(client, init_db, log_in_default_user):
    response = client.get("/api/user/1/friends/2")
    assert response.status_code == 200
    assert b"success" in response.data
    assert b"isFriend" in response.data
    assert b"friendRequest" in response.data


def test_friend_request(client, init_db, log_in_default_user):
    response = client.get("/api/user/1/friends/request")
    assert response.status_code == 200
    assert b"success" in response.data
    assert b"friendRequest" in response.data


def test_update_user_info(auth_client, init_db, log_in_default_user):
    response = auth_client.put("/api/user/1", json={"username": "updatedUser"})
    assert response.status_code == 200
    assert b"User updated" in response.data
    assert b"updatedUser" in response.data


def test_send_friend_request(auth_client, init_db, log_in_default_user):
    response = auth_client.post("/api/user/2/friends/request")
    assert response.status_code == 200
    assert b"Friend request sent" in response.data
