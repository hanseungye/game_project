from fastapi import FastAPI, HTTPException, APIRouter, Depends
from pydantic import BaseModel, EmailStr

from sqlalchemy import text
from sqlalchemy.orm import Session

from database import get_db
from services.email_service import send_verification_email
import bcrypt

import secrets
import traceback

"""
회원가입 
post: http://localhost/auth/signup
"""

user_router = APIRouter(
    prefix="/auth", tags=["users"]  # 모든 라우터 경로가 이렇게 설정됨.
)

verification_codes: dict[str, str] = {}


class EmailSendRequest(BaseModel):
    email: EmailStr


class RegisterRequest(BaseModel):
    nickname: str
    email: str
    login_id: str
    password: str


class LoginRequest(BaseModel):
    email: str
    password: str


class VerifyCodeRequest(BaseModel):
    email: EmailStr
    code: str


# PostgreSQL 연결 테스트
@user_router.get("/db-test")
def db_test(db: Session = Depends(get_db)):
    try:
        result = db.execute(text("SELECT 1"))
        return {"database": "connected", "result": result.scalar()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"DB 연결 실패: {str(e)}")


@user_router.post("/signup")
async def member_post(request: RegisterRequest, db: Session = Depends(get_db)):
    try:
        hashed_password = bcrypt.hashpw(
            request.password.encode(), bcrypt.gensalt()
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
                "nickname": request.nickname,
                "email": request.email,
                "login_id": request.login_id,
                "password_hash": hashed_password,
            },
        )
        db.commit()
        return {"message": "회원가입 성공"}
    except Exception as e:
        db.rollback()

        raise HTTPException(status_code=500, detail=f"회원가입 실패: {str(e)}")


@user_router.post("/email/send_code")
async def send_message(request: EmailSendRequest, db: Session = Depends(get_db)):
    # 0. 이미 가입된 이메일인지 확인
    query = text("""
        SELECT id
        FROM users
        WHERE email = :email
        LIMIT 1
        """
    )

    result = db.execute(query, {"email": request.email})

    existing_user = result.first()

    # 이미 가입된 이메일이면 인증번호 발송 X
    if existing_user:
        raise HTTPException(status_code=409, detail="이미 가입된 이메일입니다.")

    try:
        # 1. 6자리 인증번호 생성
        verification_code = f"{secrets.randbelow(1000000):06d}"

        # 2. 입력받은 이메일로 인증번호 전송
        send_verification_email(
            receiver_email=request.email, verification_code=verification_code
        )
        # 3. 이메일 발송 성공 후 서버에 인증번호 저장
        verification_codes[str(request.email)] = verification_code
        # 개발 테스트용
        print("발급된 인증번호:", verification_code)

        return {"message": "이메일 발송 성공"}

    except Exception as e:
        print("이메일 발송 실패:", e)

        # 에러 발생 위치까지 전체 출력
        traceback.print_exc()

        raise HTTPException(status_code=500, detail="이메일 발송에 실패했습니다.")


# 인증번호 확인 함수
@user_router.post("/email/verify-code")
async def verify_code(request: VerifyCodeRequest):
    email = str(request.email)

    # 1. 해당 이메일로 발급된 인증번호 조회
    saved_code = verification_codes.get(email)

    # 2. 발급된 인증번호가 없는 경우
    if saved_code is None:
        raise HTTPException(status_code=400, detail="발급된 인증번호가 없습니다.")
    # 3. 사용자가 입력한 코드와 비교
    if saved_code != request.code:
        raise HTTPException(
            status_code=400, detail="인증번호가 일치하지 않습니다. 다시 입력해주세요."
        )
    # 4. 인증 성공 -> 사용한 인증번호 폐기
    del verification_codes[email]

    return {"verified": True, "message": "이메일 인증이 완료되었습니다."}
