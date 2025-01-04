from app.models.pin import Pin

def test_create_pin():
    pin = Pin(latitude=10.01, longitude=10.01)
    assert pin.latitude == 10.01
    assert pin.longitude == 10.01
    assert pin.__repr__() == "<Pin: None>"
    assert pin.id is None
    assert pin.latitude is not None
    assert pin.longitude is not None

def test_new_pin_with_fixture(new_pin):
    assert new_pin.latitude == 10.01
    assert new_pin.longitude == 10.01

def test_pin_id(new_pin):
    new_pin.id = 17
    assert isinstance(new_pin.id, int)
    assert not isinstance(new_pin.id, str)
    assert new_pin.id == 17

def test_pin_latitude(new_pin):
    assert new_pin.latitude == 10.01
    assert new_pin.latitude != 10.02

def test_pin_longitude(new_pin):
    assert new_pin.longitude == 10.01
    assert new_pin.longitude != 10.02



# from werkzeug.security import check_password_hash

# from app.models.story import Story


# def test_create_story():
#     story = Story(tittle="Test Story", content="This is a test story")
#     assert story.tittle == "Test Story"
#     assert story.content == "This is a test story"
#     assert story.__repr__() == "<Story: Test Story>"
#     assert story.created_at is not None
#     assert story.updated_at is not None


# def test_new_story_with_fixture(new_story):
#     assert new_story.tittle == "Test Story"
#     assert new_story.content == "This is a test story"


# def test_story_id(new_story):
#     new_story.id = 17
#     assert isinstance(new_story.id, int)
#     assert not isinstance(new_story.id, str)
#     assert new_story.id == 17

# def test_story_tittle(new_story):
#     assert new_story.tittle == "Test Story"
#     assert new_story.tittle != "This is a test story"

# def test_story_content(new_story):
#     assert new_story.content == "This is a test story"
#     assert new_story.content != "Test Story"

