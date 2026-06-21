from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from jose import JWTError

from app.database.database import get_db
from app.models.models import User
from app.services.auth_service import decode_token

bearer_scheme = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: AsyncSession = Depends(get_db),
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        print("\n========== AUTH DEBUG ==========")
        print("RAW TOKEN:", credentials.credentials)

        payload = decode_token(credentials.credentials)

        print("TOKEN PAYLOAD:", payload)

        user_id = payload.get("sub")

        print("USER ID:", user_id)

        if user_id is None:
            print("ERROR: No 'sub' found in token")
            raise credentials_exception

    except JWTError as e:
        print("JWT ERROR:", str(e))
        raise credentials_exception

    result = await db.execute(
        select(User).where(User.id == user_id)
    )

    user = result.scalar_one_or_none()

    print("FOUND USER:", user)

    if user is None:
        print("ERROR: User not found")
        raise credentials_exception

    if not user.is_active:
        print("ERROR: User is inactive")
        raise credentials_exception

    print("AUTH SUCCESS")
    print("================================\n")

    return user


async def get_admin_user(
    current_user: User = Depends(get_current_user),
) -> User:
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )

    return current_user