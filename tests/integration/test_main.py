def test_index(client, init_db):
    response = client.get("/")
    assert response.status_code == 200
    assert b"<div id=\"root\"></div>" in response.data
