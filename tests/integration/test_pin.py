from app import db
from app.models.pin import Pin

def test_list_pins(client, init_db):
    response = client.get("/api/pin/")
    assert response.status_code == 200
    assert b"Pins found" in response.data


def test_list_pins_not_found(client, init_db):
    Pin.query.delete()
    db.session.commit()
    response = client.get("/api/pin/")
    assert response.status_code == 404
    assert b"No pins found" in response.data
