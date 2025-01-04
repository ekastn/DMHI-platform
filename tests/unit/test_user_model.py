from app.models.user import User


def test_create_user(new_user):
    assert new_user.username == "usertest"
    assert new_user.email == "user@test.com"
    assert new_user.password_hash != "test"


def test_new_user():
    user = User(username="usertest", email="haha@test.com")
    user.set_password("FlaskIsAwesome")
    assert user.username == "usertest"
    assert user.password_hash != "FlaskIsAwesome"
    assert user.email == "haha@test.com"
    assert user.__repr__() == "<User: usertest>"


def test_new_user_with_fixture(new_user):
    assert new_user.username == "usertest"
    assert new_user.password_hash != "test"


def test_setting_password(new_user):
    new_user.set_password("MyNewPassword")
    assert new_user.password_hash != "MyNewPassword"
    assert new_user.check_password("MyNewPassword")
    assert not new_user.check_password("MyNewPassword2")
    assert not new_user.check_password("Password")


def test_user_id(new_user):
    new_user.id = 17
    assert isinstance(new_user.id, int)
    assert not isinstance(new_user.id, str)
    assert new_user.id == 17
