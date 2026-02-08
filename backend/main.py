from fastapi import FastAPI
from database import create_db_and_tables
from routers import users, events

app = FastAPI()

app.include_router(users.router, tags=["users"])
app.include_router(events.router, tags=["events"])


@app.on_event("startup")
def on_startup():
    create_db_and_tables()


@app.get("/")
async def root():
    return {"message": "Welcome to your Personal Calendar API"}
