from io import BytesIO
from unittest.mock import patch

from PIL import Image

from app.services.storage_service import compress_image, delete_file, upload_file


def create_test_image():
    file = BytesIO()
    image = Image.new("RGB", (800, 600), color="red")
    image.save(file, "jpeg")
    file.seek(0)
    return file.read()


def test_compress_image():
    test_image_bytes = create_test_image()
    compressed = compress_image(test_image_bytes)

    # Check if compressed image is smaller
    assert len(compressed) < len(test_image_bytes)

    # Check if it's still a valid image
    Image.open(BytesIO(compressed))


@patch("app.services.storage_service.storage")
def test_upload_file(mock_storage, init_db):
    mock_storage.create_file.return_value = {"$id": "test_id"}

    test_image_bytes = create_test_image()
    result = upload_file(test_image_bytes, 1)

    assert "file_path" in result
    assert "test_id" in result["file_path"]
