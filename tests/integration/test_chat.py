def test_list_user_chats(auth_client, init_db, log_in_default_user):
    response = auth_client.get("/api/chats/")
    assert response.status_code == 200
    assert b"Chats fetched successfully" in response.data
    assert b"chatRooms" in response.data


def test_get_or_create_chat(auth_client, init_db, log_in_default_user):
    response = auth_client.patch("/api/chats/", json={"recipientId": 2})
    assert response.status_code == 200
    assert b"Chat fetched successfully" in response.data
    assert b"chatRoomId" in response.data
