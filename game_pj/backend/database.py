import os

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker


load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

# 만약 데이터베이스 경로가 설정되지 않았으면
if not DATABASE_URL:
    # raise : 에러를 강제로 일으키려고 할 때 사용함.
    raise RuntimeError("DATABASE_URL이 설정되지 않았습니다.")

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping = True,
)

SessionLocal = sessionmaker(
    bind = engine,
    autocommit= False,
    autoflush = False,

)

def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()

