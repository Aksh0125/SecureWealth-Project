"""
SecureWealth Twin — Physical Assets Router.
"""

import uuid

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.db.database import get_db
from backend.app.middleware.auth_middleware import get_current_user
from backend.app.models.user import User
from backend.app.schemas.asset_schemas import (
    AssetSummaryByCategory, PhysicalAssetCreateRequest,
    PhysicalAssetResponse, PhysicalAssetUpdateRequest,
)
from backend.app.services.asset_service import PhysicalAssetService

router = APIRouter()


@router.post(
    "", response_model=PhysicalAssetResponse, status_code=status.HTTP_201_CREATED,
    summary="Register a new physical asset",
)
async def add_asset(
    req: PhysicalAssetCreateRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Add property, gold, vehicle, jewellery, or any other real-world asset.
    Supported categories: real_estate | gold | vehicle | jewellery | art_collectible | business | other

    Metadata examples:
    - real_estate: {"location": "Mumbai", "area_sqft": 850, "registration_no": "MH123"}
    - gold:        {"weight_grams": 50, "purity": "22K", "form": "coin"}
    - vehicle:     {"make": "Honda", "model": "City", "year": 2021, "reg_no": "MH01AB1234"}
    """
    svc = PhysicalAssetService(db)
    try:
        return await svc.add_asset(current_user.id, req)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))


@router.get("", response_model=list[PhysicalAssetResponse], summary="List all current physical assets")
async def list_assets(
    category: str | None = Query(None, description="Filter by: real_estate | gold | vehicle | jewellery | art_collectible | business | other"),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    svc = PhysicalAssetService(db)
    try:
        return await svc.list_assets(current_user.id, category=category)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))


@router.get("/summary", response_model=list[AssetSummaryByCategory], summary="Category-level asset totals")
async def asset_summary(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Returns total value, effective value, and outstanding loans grouped by category."""
    svc = PhysicalAssetService(db)
    return await svc.category_summary(current_user.id)


@router.get("/{asset_id}", response_model=PhysicalAssetResponse, summary="Get a single physical asset")
async def get_asset(
    asset_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    svc = PhysicalAssetService(db)
    try:
        return await svc.get_asset(current_user.id, asset_id)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc))


@router.patch("/{asset_id}", response_model=PhysicalAssetResponse, summary="Update asset valuation")
async def update_asset(
    asset_id: uuid.UUID,
    req: PhysicalAssetUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Update asset details by retiring the old record and creating a new snapshot.
    Valuation history is preserved automatically.
    """
    svc = PhysicalAssetService(db)
    try:
        return await svc.update_asset(current_user.id, asset_id, req)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc))


@router.delete("/{asset_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Remove an asset")
async def delete_asset(
    asset_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    svc = PhysicalAssetService(db)
    try:
        await svc.delete_asset(current_user.id, asset_id)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc))
