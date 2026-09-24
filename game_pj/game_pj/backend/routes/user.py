from fastapi import FastAPI,HTTPException,APIRouter,Depends
from pydantic import BaseModel

from sqlalchemy import text
from sqlalchemy.orm import Session

from database import get_db

import bcrypt
import uuid
"""
회원가입 
post: http://localhost/auth/signup
"""

user_router = APIRouter(
    prefix="/auth", # 모든 라우터 경로가 이렇게 설정됨.
    tags = ["users"]
)

class RegisterRequest(BaseModel):
    nickname : str
    email : str
    login_id : str
    password : str

class LoginRequest(BaseModel):
    email : str
    password: str
# PostgreSQL 연결 테스트

@user_router.get("/db-test")
def db_test(db: Session = Depends(get_db)):
    try:
        result = db.execute(
            text("SELECT 1")
        )
        return {
            "database": "connected",
            "result": result.scalar()
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"DB 연결 실패: {str(e)}"
        )

@user_router.post("/signup")
async def member_post(
    request:RegisterRequest,
    db : Session = Depends(get_db)
):
    try:
        hashed_password = bcrypt.hashpw(
            request.password.encode(),
            bcrypt.gensalt()
        ).decode("utf-8")
        query = text("""
            INSERT INTO users(
                nickname,
                email,
                login_id,
                password_hash
            ) 
            Values (
                :nickname,
                :email,
                :login_id,
                :password_hash
            )
        """)

        db.execute(
            query,
            {
                "nickname":request.nickname,
                "email" : request.email,
                "login_id":request.login_id,
                "password_hash" : hashed_password
            }
        )
        db.commit()
        return {
            "message" : "회원가입 성공"
        }
    except Exception as e:
        db.rollback()

        raise HTTPException(
            status_code=500,
            detail = f"회원가입 실패: {str(e)}"
        )


@user_router.get("/signup")
async def member_get():
    return {
        "message":"GET 테스트 성공"
    }


