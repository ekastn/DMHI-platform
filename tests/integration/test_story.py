def test_get_stories(client, init_db, log_in_default_user):
    response = client.get("/api/story/")
    assert b"Stories retrieved" in response.data


def test_create_story(auth_client, init_db, log_in_default_user):
    response = auth_client.post(
        "/api/story/",
        json={"title": "New Story", "content": "This is a new story", "latitude": 37.6779, "longitude": -122.9194},
    )
    assert response.status_code == 200
    assert b"Story created" in response.data
    assert b"story" in response.data


def test_update_story(auth_client, init_db, log_in_default_user):
    response = auth_client.put("/api/story/1", json={"title": "Updated Story", "content": "This is an updated story"})
    assert response.status_code == 200
    assert b"Story updated" in response.data
    assert b"story" in response.data


def test_delete_story(auth_client, init_db, log_in_default_user):
    response = auth_client.delete("/api/story/1")
    assert response.status_code == 200
    assert b"Story deleted" in response.data


def test_get_story(client, init_db, log_in_default_user):
    response = client.get("/api/story/1")
    assert response.status_code == 200
    assert b"Story retrieved" in response.data


def test_get_story_not_found(client, init_db, log_in_default_user):
    response = client.get("/api/story/999")
    assert response.status_code == 404
    assert b"Story not found" in response.data
