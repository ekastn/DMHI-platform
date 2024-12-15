from flask_login import UserMixin
from sqlalchemy import ForeignKey, func, types, Float
from sqlalchemy.orm import mapped_column, relationship
from sqlalchemy.orm.base import Mapped
from sqlalchemy.sql.sqltypes import String
from typing_extensions import Optional
from werkzeug.security import check_password_hash, generate_password_hash

from app import db
from app.models.story import Story

class Pin(db.Model):
    __tablename__ = "pins"

    id: Mapped[int] = mapped_column("pin_id", primary_key=True)
    latitude: Mapped[float] = mapped_column(Float, unique=True)
    longitude: Mapped[float] = mapped_column(Float, unique=True)
    story_id: Mapped[int] = mapped_column(ForeignKey("stories.story_id"))
    
    story: Mapped["Story"] = relationship(back_populates="pin")
        
    def __repr__(self):
        return f"<Pin: {self.id}>"
