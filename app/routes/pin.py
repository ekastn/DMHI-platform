from flask import Blueprint

from app.helper.http import create_response, pin_payload
from app.models.pin import Pin

pin = Blueprint("pin", __name__, url_prefix="/api/pin")


@pin.route("/", methods=["GET"])
def list_pins():
    pins = Pin.query.all()

    if not pins:
        return create_response(success=False, message="No pins found", status_code=404)

    pins_json = [pin_payload(pin) for pin in pins]

    return create_response(success=True, message="Pins found", status_code=200, data={"pins": pins_json})
