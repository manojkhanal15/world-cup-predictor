from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, delete
from app.database.database import get_db
from app.models.models import User, Prediction
from app.schemas.schemas import AdminUserResponse, AdminStatsResponse, PredictionResponse
from app.middleware.auth_middleware import get_admin_user
from typing import List

router = APIRouter(prefix="/api/admin", tags=["admin"])


@router.get("/users", response_model=List[AdminUserResponse])
async def get_all_users(
    current_user: User = Depends(get_admin_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(User).order_by(User.created_at.desc()))
    users = result.scalars().all()

    user_list = []
    for user in users:
        count_result = await db.execute(
            select(func.count(Prediction.id)).where(Prediction.user_id == user.id)
        )
        prediction_count = count_result.scalar_one()
        user_list.append(
            AdminUserResponse(
                id=user.id,
                name=user.name,
                email=user.email,
                is_admin=user.is_admin,
                is_active=user.is_active,
                created_at=user.created_at,
                prediction_count=prediction_count,
            )
        )
    return user_list


@router.get("/predictions", response_model=List[PredictionResponse])
async def get_all_predictions(
    current_user: User = Depends(get_admin_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Prediction).order_by(Prediction.created_at.desc())
    )
    return result.scalars().all()


@router.delete("/predictions/{prediction_id}", status_code=204)
async def admin_delete_prediction(
    prediction_id: str,
    current_user: User = Depends(get_admin_user),
    db: AsyncSession = Depends(get_db),
):
    await db.execute(delete(Prediction).where(Prediction.id == prediction_id))
    await db.flush()


@router.get("/stats", response_model=AdminStatsResponse)
async def get_stats(
    current_user: User = Depends(get_admin_user),
    db: AsyncSession = Depends(get_db),
):
    total_users = (await db.execute(select(func.count(User.id)))).scalar_one()
    total_predictions = (await db.execute(select(func.count(Prediction.id)))).scalar_one()
    complete_predictions = (
        await db.execute(
            select(func.count(Prediction.id)).where(Prediction.is_complete == True)
        )
    ).scalar_one()

    # Most predicted champion
    champ_result = await db.execute(
        select(Prediction.champion, func.count(Prediction.champion).label("cnt"))
        .where(Prediction.champion.isnot(None))
        .group_by(Prediction.champion)
        .order_by(func.count(Prediction.champion).desc())
        .limit(1)
    )
    champ_row = champ_result.first()
    most_predicted_champion = champ_row[0] if champ_row else None

    return AdminStatsResponse(
        total_users=total_users,
        total_predictions=total_predictions,
        complete_predictions=complete_predictions,
        most_predicted_champion=most_predicted_champion,
    )