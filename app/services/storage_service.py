import io
import os
import re

from appwrite.client import Client
from appwrite.input_file import InputFile
from appwrite.services.storage import Storage
from flask import current_app
from PIL import Image

from app import db
from app.models.user import User

PROJECT_ID = os.getenv("AW_PROJECT_ID")
BUCKET_ID = os.getenv("AW_BUCKET_ID")
API_KEY = os.getenv("AW_API_KEY")

client = Client()
client.set_endpoint("https://cloud.appwrite.io/v1")
client.set_project(PROJECT_ID)
client.set_key(API_KEY)

storage = Storage(client)


def compress_image(image_bytes: bytes) -> bytes:
    target_size = 360  # Target size for the resized image (width and height).
    max_file_size = 300 * 1024  # Maximum file size in bytes

    image = Image.open(io.BytesIO(image_bytes))
    image = image.convert("RGB")

    # resize the image
    image.thumbnail((target_size, target_size), Image.Resampling.LANCZOS)

    # Crop the image to a square
    width, height = image.size
    min_dim = min(width, height)
    left = (width - min_dim) / 2
    top = (height - min_dim) / 2
    right = (width + min_dim) / 2
    bottom = (height + min_dim) / 2
    image = image.crop((left, top, right, bottom))

    # Compress the image
    output = io.BytesIO()
    quality = 85
    while True:
        output.seek(0)
        image.save(output, format="JPEG", quality=quality)
        if output.tell() <= max_file_size or quality <= 10:
            break
        quality -= 5

    return output.getvalue()


def upload_file(file_bytes: bytes, user_id: int, file_id: str = "unique()") -> dict:
    user = User.query.get(user_id)
    if not user:
        return {"error": "User not found"}

    try:
        delete_existing_file(user)

        processed_bytes = compress_image(file_bytes)
        file_name = f"{user_id}_profile.jpg"

        response = storage.create_file(
            bucket_id=BUCKET_ID,
            file_id=file_id,
            file=InputFile.from_bytes(processed_bytes, file_name),
        )

        file_path = f"https://cloud.appwrite.io/v1/storage/buckets/{BUCKET_ID}/files/{response['$id']}/view?project={PROJECT_ID}"

        user.profile_image = file_path
        db.session.commit()

        return {"file_path": file_path}
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error uploading file: {e}")
        return {"error": str(e)}


def delete_file(file_id: str):
    try:
        storage.delete_file(
            bucket_id=BUCKET_ID,
            file_id=file_id,
        )
        current_app.logger.info(f"File {file_id} deleted successfully")
    except Exception as e:
        current_app.logger.error(f"Error deleting file: {e}")


def delete_existing_file(user: User):
    if user.profile_image:
        match = re.search(r"/files/([^/]+)/view", user.profile_image)
        if match:
            file_id = match.group(1)
            delete_file(file_id)
