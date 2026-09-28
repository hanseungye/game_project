from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from routes.auth import user_router
from routes.login.loginauth import login_router


app = FastAPI()

app.include_router(user_router)
app.include_router(login_router)

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins = origins,
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"]
)


@app.get("/")
def read_root():
    return {"message" : "crypto"}


print("=== login_router 확인 ===")

for route in login_router.routes:
    print(
        "path:",
        getattr(route, "path", None),
        "methods:",
        getattr(route, "methods", None)
    )