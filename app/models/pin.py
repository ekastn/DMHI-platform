from flask_login import UserMixin
from sqlalchemy import func, types, Float
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm.base import Mapped
from sqlalchemy.sql.sqltypes import String
from typing_extensions import Optional
from werkzeug.security import check_password_hash, generate_password_hash

from app import db

class Pin(db.Model):
    __tablename__ = "pins"

    id: Mapped[int] = mapped_column("pin_id", primary_key=True)
    latitude: Mapped[float] = mapped_column(Float, unique=True, nullable=False)
    longitude: Mapped[float] = mapped_column(Float, unique=True, nullable=False)

    def __init__(self, latitude: float, longitude: float):
        self.latitude = latitude
        self.longitude = longitude
        
    def __repr__(self):
        return f"<Pin: {self.id}>"
