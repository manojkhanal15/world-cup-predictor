from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.database import get_db
from app.models.models import User
from app.schemas.schemas import PredictionCreate, PredictionUpdate, PredictionResponse
from app.services import prediction_service
from app.middleware.auth_middleware import get_current_user
from typing import List

router = APIRouter(prefix="/api/predictions", tags=["predictions"])


@router.post("", response_model=PredictionResponse, status_code=status.HTTP_201_CREATED)
async def create_prediction(
    data: PredictionCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    prediction = await prediction_service.create_prediction(db, current_user.id, data)
    return prediction


@router.get("", response_model=List[PredictionResponse])
async def get_predictions(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    predictions = await prediction_service.get_user_predictions(db, current_user.id)
    return predictions


@router.get("/{prediction_id}", response_model=PredictionResponse)
async def get_prediction(
    prediction_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    prediction = await prediction_service.get_prediction_by_id(db, prediction_id, current_user.id)
    if not prediction:
        raise HTTPException(status_code=404, detail="Prediction not found")
    return prediction


@router.put("/{prediction_id}", response_model=PredictionResponse)
async def update_prediction(
    prediction_id: str,
    data: PredictionUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    prediction = await prediction_service.get_prediction_by_id(db, prediction_id, current_user.id)
    if not prediction:
        raise HTTPException(status_code=404, detail="Prediction not found")
    prediction = await prediction_service.update_prediction(db, prediction, data)
    return prediction


@router.delete("/{prediction_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_prediction(
    prediction_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    prediction = await prediction_service.get_prediction_by_id(db, prediction_id, current_user.id)
    if not prediction:
        raise HTTPException(status_code=404, detail="Prediction not found")
    await prediction_service.delete_prediction(db, prediction)