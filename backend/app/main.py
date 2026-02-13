from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from authlib.integrations.starlette_client import OAuth
from app.db.base import Base
from app.db.session import engine
from app.routers import users, events, auth
from app.core.config import settings
from starlette.config import Config


def create_db_and_tables():
    Base.metadata.create_all(bind=engine)


app = FastAPI(title=settings.PROJECT_NAME)


# Load config for Authlib
config = Config(".env")
oauth = OAuth(config=config)
auth.set_oauth_client(oauth)
auth.register_oauth_clients()

origins = [
    settings.FRONTEND_URL,
    f"{settings.FRONTEND_URL}/",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(SessionMiddleware, secret_key=settings.SECRET_KEY)

app.include_router(users.router, tags=["users"])
app.include_router(events.router, tags=["events"])
app.include_router(auth.router, tags=["auth"])


@app.on_event("startup")
def on_startup():
    create_db_and_tables()


@app.get("/")
async def root():
    return {"message": f"Welcome to {settings.PROJECT_NAME} API"}
