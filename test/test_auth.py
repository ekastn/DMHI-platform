def test_login_page(client):
    response = client.get("/login")
    assert response.status_code == 200
    assert b"Login" in response.data
    assert b"username" in response.data
    assert b"password" in response.data


def test_valid_login_logout(client, init_db):
    response = client.post(
        "/login",
        data={"username": "defTestUser", "password": "userTest1"},
        follow_redirects=True,
    )
    assert response.status_code == 200
    assert b"DMHI Platform" in response.data
    assert b"Welcome Back!" in response.data

    response = client.get("/logout", follow_redirects=True)
    assert response.status_code == 200
    assert b"DMHI Platform" in response.data
    assert b"Goodbye!" in response.data


def test_invalid_login(client, init_db):
    response = client.post(
        "/login",
        data={"username": "randomUser", "password": "random"},
        follow_redirects=True,
    )
    assert response.status_code == 200
    assert b"Login" in response.data
    assert b"username" in response.data
    assert b"password" in response.data
    assert b"Invalid username or password" in response.data


def test_login_when_already_logged_in(client, init_db, log_in_default_user):
    response = client.post(
        "/login",
        data={"username": "defTestUser", "password": "userTest1"},
        follow_redirects=True,
    )
    assert response.status_code == 200
    assert b"DMHI Platform" in response.data
    assert b"Already logged in" in response.data


def test_register_page(client):
    response = client.get("/register")
    assert response.status_code == 200
    assert b"Register" in response.data
    assert b"username" in response.data
    assert b"password" in response.data
    assert b"email" in response.data


def test_valid_registration(client, init_db):
    response = client.post(
        "/register",
        data={
            "username": "HumanNoid",
            "password": "HumanIsGood",
            "email": "human@good.com",
        },
        follow_redirects=True,
    )
    assert response.status_code == 200
    assert b"DMHI Platform" in response.data
    assert b"Welcome HumanNoid!" in response.data


def test_duplicate_user_registration(client, init_db):
    client.post(
        "/register",
        data={"username": "newuser", "password": "newuser", "email": "newuser@test.com"},
        follow_redirects=True,
    )
    client.get("/logout")

    response = client.post(
        "/register",
        data={"username": "newuser", "password": "newuser", "email": "newuser@test.com"},
        follow_redirects=True,
    )
    assert b"Username or email already taken" in response.data
    assert b"Welcome" not in response.data


def test_register_when_already_logged_in(client, init_db, log_in_default_user):
    response = client.post(
        "/register",
        data={"username": "someuser", "password": "password", "email": "password@sss.com"},
        follow_redirects=True,
    )
    assert response.status_code == 200
    assert b"Already logged in" in response.data
    assert b"Welcome (someuser)" not in response.data
