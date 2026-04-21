"""
SecureWealth Twin — Auth Router.

POST /api/v1/auth/register   → Create account
POST /api/v1/auth/login      → Get JWT access + refresh tokens
POST /api/v1/auth/refresh    → Exchange refresh for new access token
POST /api/v1/auth/logout     → Client-side token teardown (stateless)
GET  /api/v1/auth/me         → Current user profile
PATCH /api/v1/auth/me        → Update profile fields
"""

from __future__ import annotations

import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Request, status
from passlib.context import CryptContext
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.config import get_settings
from backend.app.db.database import get_db
from backend.app.middleware.auth_middleware import (
    create_access_token,
    create_refresh_token,
    decode_token,
    get_current_user,
)
from backend.app.models.user import User, UserRole
from backend.app.models.wealth_profile import WealthProfile

router   = APIRouter()
settings = get_settings()
pwd_ctx  = CryptContext(schemes=["bcrypt"], deprecated="auto")


# ── Schemas ───────────────────────────────────────────────────────────────────

class RegisterRequest(BaseModel):
    email:     EmailStr
    password:  str     = Field(..., min_length=8)
    full_name: str | None = None
    phone:     str | None = None


class LoginRequest(BaseModel):
    email:    EmailStr
    password: str


class RefreshRequest(BaseModel):
    refresh_token: str


class TokenResponse(BaseModel):
    access_token:  str
    refresh_token: str
    token_type:    str = "bearer"


class UserProfileResponse(BaseModel):
    id:           uuid.UUID
    email:        str
    full_name:    str | None
    phone:        str | None
    role:         UserRole
    kyc_status:   str
    is_verified:  bool
    created_at:   datetime

    model_config = {"from_attributes": True}


class ProfileUpdateRequest(BaseModel):
    full_name: str | None = None
    phone:     str | None = None
    aa_vua:    str | None = None  # Virtual User Address for AA


# ── Helpers ───────────────────────────────────────────────────────────────────

def _hash(password: str) -> str:
    return pwd_ctx.hash(password)

def _verify(plain: str, hashed: str) -> bool:
    return pwd_ctx.verify(plain, hashed)


# ── Endpoints ─────────────────────────────────────────────────────────────────

@router.post(
    "/register",
    response_model=TokenResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new user account",
)
async def register(req: RegisterRequest, db: AsyncSession = Depends(get_db)):
    # Duplicate check
    stmt   = select(User).where(User.email == req.email)
    result = await db.execute(stmt)
    if result.scalar_one_or_none():
        raise HTTPException(status_code=409, detail="Email already registered")

    user = User(
        email=req.email,
        hashed_password=_hash(req.password),
        full_name=req.full_name,
        phone=req.phone,
        role=UserRole.CUSTOMER,
        is_active=True,
    )
    db.add(user)
    await db.flush()

    # Create empty WealthProfile
    profile = WealthProfile(user_id=user.id)
    db.add(profile)
    await db.flush()
    await db.refresh(user)

    return TokenResponse(
        access_token=create_access_token(user.id),
        refresh_token=create_refresh_token(user.id),
    )


@router.post("/login", response_model=TokenResponse, summary="Login and get JWT tokens")
async def login(req: LoginRequest, db: AsyncSession = Depends(get_db)):
    stmt   = select(User).where(User.email == req.email)
    result = await db.execute(stmt)
    user   = result.scalar_one_or_none()

    if not user or not _verify(req.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    if not user.is_active:
        raise HTTPException(status_code=403, detail="Account is deactivated")

    return TokenResponse(
        access_token=create_access_token(user.id),
        refresh_token=create_refresh_token(user.id),
    )


@router.post("/refresh", response_model=TokenResponse, summary="Refresh access token")
async def refresh(req: RefreshRequest, db: AsyncSession = Depends(get_db)):
    payload = decode_token(req.refresh_token)
    if payload.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="Not a refresh token")

    user_id = uuid.UUID(payload["sub"])
    stmt    = select(User).where(User.id == user_id)
    result  = await db.execute(stmt)
    user    = result.scalar_one_or_none()

    if not user or not user.is_active:
        raise HTTPException(status_code=401, detail="User not found")

    return TokenResponse(
        access_token=create_access_token(user.id),
        refresh_token=create_refresh_token(user.id),
    )


@router.post("/logout", status_code=200, summary="Logout (client clears tokens)")
async def logout():
    # Stateless JWT — client discards tokens.
    # For blacklisting, store token jti in Redis here.
    return {"message": "Logged out successfully"}


@router.get("/me", response_model=UserProfileResponse, summary="Get current user profile")
async def me(current_user: User = Depends(get_current_user)):
    return UserProfileResponse.model_validate(current_user)


@router.patch("/me", response_model=UserProfileResponse, summary="Update profile")
async def update_me(
    req: ProfileUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if req.full_name is not None:
        current_user.full_name = req.full_name
    if req.phone is not None:
        current_user.phone = req.phone
    if req.aa_vua is not None:
        current_user.aa_vua = req.aa_vua

    db.add(current_user)
    await db.flush()
    await db.refresh(current_user)
    return UserProfileResponse.model_validate(current_user)
