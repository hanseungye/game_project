from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, EmailStr

from sqlalchemy import text
from sqlalchemy.orm import Session

from database import get_db
import bcrypt

login_router = APIRouter(
    prefix="/auth",
    tags=["login"]
)

class LoginRequest(BaseModel):
    email : EmailStr
    password : str

@login_router.post("/login")
async def login_test(
    request: LoginRequest,
    db : Session = Depends(get_db)
): 
    print("로그인 API 진입")

    print("받은 이메일:",request.email)
    print("받은 비밀번호:",request.password)
    # 1. 이메일로 사용자 조회
    query = text("""
        SELECT id,email,password_hash
        FROM users
        WHERE email = :email
        LIMIT 1
    """)

    result = db.execute(
        query,
        {
            "email" : request.email
        }
    )
    user = result.mappings().first()

    if user is None :
        raise HTTPException(
            status_code= 401,
            detail= "이메일 또는 비밀번호를 다시 입력해주세요."
        )
    password_metched = bcrypt.checkpw(
        request.password.encode("utf-8"),
        user["password_hash"].encode("utf-8")
    )

    if not password_metched:
        raise HTTPException(
            status_code= 401,
            detail="이메일 또는 비밀번호를 다시 입력해주세요."
        )
    return {
        "message" : "일치합니다."
    }

    

