from typing import Any, Dict, Optional, Tuple

from flask import Response, jsonify


def create_response(
    success: bool = False,
    message: str = "",
    data: Optional[Dict[str, Any]] = None,
    status_code: int = 200,
) -> Tuple[Response, int]:
    response: Dict[str, Any] = {
        "success": success,
        "message": message,
        "data": data,
    }
    return jsonify(response), status_code
