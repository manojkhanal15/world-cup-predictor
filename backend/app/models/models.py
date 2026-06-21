from sqlalchemy import (
    Column, String, Integer, Boolean, DateTime, ForeignKey, Text, JSON
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
from app.database.database import Base


def generate_uuid():
    return str(uuid.uuid4())


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    is_admin = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    predictions = relationship("Prediction", back_populates="user", cascade="all, delete-orphan")


class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    name = Column(String(200), nullable=False, default="My Prediction")

    # Group stage results stored as JSON
    # Format: { "A": { "winner": "USA", "runner_up": "Mexico" }, ... }
    group_results = Column(JSON, nullable=True)

    # Knockout bracket stored as JSON
    # Format: { "r32": [...matches], "r16": [...], "qf": [...], "sf": [...], "final": {...}, "third_place": {...} }
    bracket = Column(JSON, nullable=True)

    # Final results
    champion = Column(String(100), nullable=True)
    runner_up = Column(String(100), nullable=True)
    third_place = Column(String(100), nullable=True)

    is_complete = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())

    user = relationship("User", back_populates="predictions")