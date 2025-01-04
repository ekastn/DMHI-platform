def test_get_stories(client, init_db, log_in_default_user):
    response = client.get("/api/story/")
    assert b"Stories retrieved" in response.data
