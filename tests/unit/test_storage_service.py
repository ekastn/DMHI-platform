from io import BytesIO
from unittest.mock import patch

from PIL import Image

from app import db
from app.models.user import User
from app.services.storage_service import compress_image, delete_existing_file, delete_file, upload_file


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


def test_delete_existing_file(init_db):
    user = User.query.filter_by(username="defTestUser").first()
    user.profile_image = (
        "https://cloud.appwrite.io/v1/storage/buckets/test_bucket/files/test_file_id/view?project=test_project"
    )
    db.session.commit()
    with patch("app.services.storage_service.delete_file") as mock_delete:
        delete_existing_file(user)
        mock_delete.assert_called_with("test_file_id")
