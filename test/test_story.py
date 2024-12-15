import json
import pytest
from app.models.story import Story
from app.models.pin import Pin

@pytest.mark.usefixtures("init_db", "log_in_default_user")
def test_create_story(client):
    response = client.post(
        "/api/story/",
        data=json.dumps(
            {
                "tittle": "Test Story",
                "content": "This is a test story",
                "latitude": 37.7749,
                "longitude": -122.4194,
            }
        ),
        content_type="application/json",
    )
    assert response.status_code == 201
    assert b"Story created" in response.data
    assert b"Test Story" in response.data
    assert b"This is a test story" in response.data

    story = Story.query.filter(Story.tittle == "Test Story").first()
    assert story is not None
    assert story.content == "This is a test story"

    pin = Pin.query.filter(Pin.latitude == 37.7749, Pin.longitude == -122.4194).first()
    assert pin is not None
    assert pin.story is not None
@pytest.mark.usefixtures("init_db", "log_in_default_user")
def test_get_stories(client, init_db, log_in_default_user):
    response = client.get("/api/story/")
    assert b"Stories retrieved" in response.data
    
@pytest.mark.usefixtures("init_db", "log_in_default_user")
def test_update_story(client):
    response = client.get("/api/story/")
    assert b"Stories retrieved" in response.data

def test_update_story(client, init_db, log_in_default_user):
    story = Story.query.filter(Story.tittle == "Test Story").first()
    response = client.put(
        f"/api/story/{story.id}",
        data=json.dumps({"tittle": "Updated Story"}),
        content_type="application/json",
    )
    assert b"Story updated" in response.data
    assert b"Updated Story" in response.data

@pytest.mark.usefixtures("init_db", "log_in_default_user")
def test_delete_story(client):
    # Test non-existent story
    response = client.get("/api/story/100")
    assert response.status_code == 404
    assert b"Story not found" in response.data

    # Test deleting existing story
    story = Story.query.filter(Story.tittle == "Test Story").first()
    response = client.delete(f"/api/story/{story.id}")
    assert b"Story deleted" in response.data

    story = Story.query.filter(Story.tittle == "Test Story").first()
    assert story is None

def test_update_deleted_story(client, init_db, log_in_default_user):
    response = client.post(
        "/api/story/",
        data=json.dumps(
            {
                "tittle": "Test Story",
                "content": "This is a test story",
                "latitude": 37.7749,
                "longitude": -122.4194,
            }
        ),
        content_type="application/json",
    )
    assert response.status_code == 201

    response = client.delete("/api/story/2")
    assert response.status_code == 200

    response = client.put(
        "/api/story/2",
        data=json.dumps({"tittle": "Updated Story"}),
        content_type="application/json",
    )
    assert response.status_code == 404
    assert b"Story not found" in response.data
