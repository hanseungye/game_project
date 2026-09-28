from fastapi import FastAPI
from routes.auth import user_router
from fastapi.middleware.cors import CORSMiddleware
from routes.login.loginauth import login_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_router)
app.include_router(login_router)

@app.get("/")
def root():
    return {"message": "FastAPI 서버 실행 성공"}
