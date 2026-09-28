from fastapi import APIRouter, HTTPException, Depends, Response, Cookie
from pydantic import BaseModel, EmailStr

from sqlalchemy import text
from sqlalchemy.orm import Session

from database import get_db
from config import JWT_SECRET_KEY

import bcrypt
import jwt

from datetime import datetime, timedelta, timezone

login_router = APIRouter(prefix="/auth", tags=["login"])


class LoginRequest(BaseModel):
    email: EmailStr
    password: str
    keep_login: bool = False


@login_router.get("/me")
async def get_current_user(
    access_token: str | None = Cookie(default=None), db: Session = Depends(get_db)
):
    if access_token is None:
        raise HTTPException(status_code=401, detail="로그인이 필요합니다.")

    try:
        payload = jwt.decode(access_token, JWT_SECRET_KEY, algorithms=["HS256"])

        user_id = payload.get("sub")

        if user_id is None:
            raise HTTPException(status_code=401, detail="유효하지 않은 토큰입니다.")

        query = text("""
            SELECT id, email, nickname
            FROM users
            WHERE id = :id
            LIMIT 1
        """)

        result = db.execute(query, {"id": int(user_id)})

        user = result.mappings().first()

        if user is None:
            raise HTTPException(
                status_code=401, detail="사용자 정보를 찾을 수 없습니다."
            )

        return {"id": user["id"], "email": user["email"], "nickname": user["nickname"]}

    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="로그인이 만료되었습니다.")

    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="유효하지 않은 토큰입니다.")


@login_router.post("/login")
async def login_test(
    request: LoginRequest, response: Response, db: Session = Depends(get_db)
):
    try:
        # 1. 이메일로 사용자 조회
        query = text("""
            SELECT id, email, password_hash
            FROM users
            WHERE email = :email
            LIMIT 1
        """)

        result = db.execute(query, {"email": request.email})

        user = result.mappings().first()

        # 2. 사용자 존재 여부 확인
        if user is None:
            raise HTTPException(
                status_code=401, detail="이메일 또는 비밀번호를 다시 입력해주세요."
            )

        # 3. 비밀번호 확인
        password_matched = bcrypt.checkpw(
            request.password.encode("utf-8"), user["password_hash"].encode("utf-8")
        )

        if not password_matched:
            raise HTTPException(
                status_code=401, detail="이메일 또는 비밀번호를 다시 입력해주세요."
            )

        # 4. JWT 만료시간 설정
        if request.keep_login:
            expire_delta = timedelta(days=30)
        else:
            expire_delta = timedelta(hours=1)

        expire = datetime.now(timezone.utc) + expire_delta

        # 5. JWT payload 생성
        payload = {"sub": str(user["id"]), "email": user["email"], "exp": expire}

        # 6. JWT 생성
        access_token = jwt.encode(payload, JWT_SECRET_KEY, algorithm="HS256")

        # 7. Cookie 저장
        if request.keep_login:
            response.set_cookie(
                key="access_token",
                value=access_token,
                httponly=True,
                max_age=60 * 60 * 24 * 30,
                samesite="lax",
                secure=False,
            )
        else:
            response.set_cookie(
                key="access_token",
                value=access_token,
                httponly=True,
                samesite="lax",
                secure=False,
            )

        return {"message": "로그인 되었습니다."}

    except HTTPException:
        raise

    except Exception as e:
        print("로그인 처리 중 오류:", e)

        raise HTTPException(status_code=500, detail="서버에서 오류가 발생했습니다.")
