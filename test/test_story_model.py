from werkzeug.security import check_password_hash

from app.models.story import Story


def test_create_story():
    story = Story(tittle="Test Story", content="This is a test story")
    assert story.tittle == "Test Story"
    assert story.content == "This is a test story"
    assert story.__repr__() == "<Story: Test Story>"



def test_new_story_with_fixture(new_story):
    assert new_story.tittle == "Test Story"
    assert new_story.content == "This is a test story"


def test_story_id(new_story):
    new_story.id = 17
    assert isinstance(new_story.id, int)
    assert not isinstance(new_story.id, str)
    assert new_story.id == 17

def test_story_tittle(new_story):
    assert new_story.tittle == "Test Story"
    assert new_story.tittle != "This is a test story"

def test_story_content(new_story):
    assert new_story.content == "This is a test story"
    assert new_story.content != "Test Story"

