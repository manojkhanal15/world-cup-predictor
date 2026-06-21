from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional, Any
from datetime import datetime


# ─── Auth Schemas ─────────────────────────────────────────────────────────────

class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str
    confirm_password: str

    @field_validator("confirm_password")
    @classmethod
    def passwords_match(cls, v, info):
        if "password" in info.data and v != info.data["password"]:
            raise ValueError("Passwords do not match")
        return v

    @field_validator("password")
    @classmethod
    def password_strength(cls, v):
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters")
        return v


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    is_admin: bool
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


# ─── Prediction Schemas ───────────────────────────────────────────────────────

class PredictionCreate(BaseModel):
    name: str = "My Prediction"
    group_results: Optional[dict[str, Any]] = None
    bracket: Optional[dict[str, Any]] = None
    champion: Optional[str] = None
    runner_up: Optional[str] = None
    third_place: Optional[str] = None
    is_complete: bool = False


class PredictionUpdate(BaseModel):
    name: Optional[str] = None
    group_results: Optional[dict[str, Any]] = None
    bracket: Optional[dict[str, Any]] = None
    champion: Optional[str] = None
    runner_up: Optional[str] = None
    third_place: Optional[str] = None
    is_complete: Optional[bool] = None


class PredictionResponse(BaseModel):
    id: str
    user_id: str
    name: str
    group_results: Optional[dict[str, Any]] = None
    bracket: Optional[dict[str, Any]] = None
    champion: Optional[str] = None
    runner_up: Optional[str] = None
    third_place: Optional[str] = None
    is_complete: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ─── Admin Schemas ────────────────────────────────────────────────────────────

class AdminUserResponse(BaseModel):
    id: str
    name: str
    email: str
    is_admin: bool
    is_active: bool
    created_at: datetime
    prediction_count: int = 0

    class Config:
        from_attributes = True


class AdminStatsResponse(BaseModel):
    total_users: int
    total_predictions: int
    complete_predictions: int
    most_predicted_champion: Optional[str] = None