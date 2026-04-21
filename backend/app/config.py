"""
SecureWealth Twin — Application Settings.

Uses pydantic-settings to load from environment variables (or .env file).
All settings are typed and validated at startup.
"""

from functools import lru_cache
from pathlib import Path
from typing import Literal

from pydantic_settings import BaseSettings, SettingsConfigDict

# Always resolve .env relative to this file (backend/.env)
# so it works no matter which directory uvicorn is launched from.
_ENV_FILE = Path(__file__).parent.parent / ".env"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=str(_ENV_FILE),
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )

    # ── App ───────────────────────────────────────────────────────────────
    ENVIRONMENT: Literal["development", "production"] = "development"
    DEBUG: bool = True
    APP_NAME: str = "SecureWealth Twin"
    APP_VERSION: str = "1.0.0"

    # ── Database ──────────────────────────────────────────────────────────
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/securewealth"
    USE_SQLITE: bool = False
    SQLITE_URL: str = "sqlite+aiosqlite:///./securewealth_dev.db"

    # ── Auth / JWT ────────────────────────────────────────────────────────
    SECRET_KEY: str = "CHANGE-ME-IN-PRODUCTION-USE-OPENSSL-RAND-HEX-32"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # ── Redis / Celery ────────────────────────────────────────────────────
    REDIS_URL: str = "redis://localhost:6379/0"
    CELERY_BROKER_URL: str = "redis://localhost:6379/1"
    CELERY_RESULT_BACKEND: str = "redis://localhost:6379/2"

    # ── Encryption (Fernet) ───────────────────────────────────────────────
    FERNET_KEY: str = "CHANGE-ME-GENERATE-WITH-FERNET"

    # ── CORS ──────────────────────────────────────────────────────────────
    ALLOWED_ORIGINS: str = "http://localhost:3000,http://localhost:5173"

    # ── Rate Limiting ─────────────────────────────────────────────────────
    RATE_LIMIT_PER_MINUTE: int = 60

    # ── Account Aggregator ────────────────────────────────────────────────
    AA_FINVU_CLIENT_ID: str = "sandbox"
    AA_FINVU_CLIENT_SECRET: str = "sandbox"
    AA_FINVU_BASE_URL: str = "https://api.finvu.in/v2"

    AA_ONEMONEY_CLIENT_ID: str = "sandbox"
    AA_ONEMONEY_CLIENT_SECRET: str = "sandbox"
    AA_ONEMONEY_BASE_URL: str = "https://api.onemoney.in/v2"

    AA_WEBHOOK_SECRET: str = "CHANGE-ME-WEBHOOK-HMAC-SECRET"

    # ── Sahamati ──────────────────────────────────────────────────────────
    SAHAMATI_TOKEN_URL: str = "https://api.sahamati.org.in/v2/auth/token"
    SAHAMATI_CLIENT_ID: str = ""
    SAHAMATI_CLIENT_SECRET: str = ""

    @property
    def allowed_origins_list(self) -> list[str]:
        return [o.strip() for o in self.ALLOWED_ORIGINS.split(",")]

    @property
    def effective_db_url(self) -> str:
        return self.SQLITE_URL if self.USE_SQLITE else self.DATABASE_URL


@lru_cache
def get_settings() -> Settings:
    return Settings()
