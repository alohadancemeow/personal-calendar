from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from starlette.requests import Request
from authlib.integrations.starlette_client import OAuthError

from app.db.session import get_db
from app.schemas import UserCreate
import app.crud as crud
from app.core.security import (
    create_access_token,
    ACCESS_TOKEN_EXPIRE_MINUTES,
)
from app.core.config import settings

router = APIRouter(prefix="/auth")

_oauth_client = None


def set_oauth_client(oauth_instance):
    global _oauth_client
    _oauth_client = oauth_instance


def register_oauth_clients():
    # Google OAuth Configuration
    _oauth_client.register(
        name="google",
        client_id=settings.GOOGLE_CLIENT_ID,
        client_secret=settings.GOOGLE_CLIENT_SECRET,
        server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
        client_kwargs={"scope": "openid email profile"},
    )

    # GitHub OAuth Configuration
    _oauth_client.register(
        name="github",
        client_id=settings.GITHUB_CLIENT_ID,
        client_secret=settings.GITHUB_CLIENT_SECRET,
        access_token_url="https://github.com/login/oauth/access_token",
        authorize_url="https://github.com/login/oauth/authorize",
        api_base_url="https://api.github.com/",
        client_kwargs={"scope": "user:email"},
        redirect_uri="http://localhost:8000/auth/github",
    )


@router.get("/login/google")
async def login_google(request: Request):
    redirect_uri = request.url_for("auth_google")
    return await _oauth_client.google.authorize_redirect(request, redirect_uri)


@router.get("/google/callback", name="auth_google")
async def auth_google(request: Request, db: Session = Depends(get_db)):
    try:
        token = await _oauth_client.google.authorize_access_token(request)
    except OAuthError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

    user_info = await _oauth_client.google.parse_id_token(token, nonce=None)

    google_id = user_info.get("sub")
    email = user_info.get("email")
    username = user_info.get("name")
    image = user_info.get("picture")

    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Google did not provide an email.",
        )

    user = crud.get_user_by_oauth_id(db, "google", google_id)
    if not user:
        user = crud.get_user_by_email(db, email)
        if user:
            # Link existing user with Google ID
            user.google_id = google_id
            user.provider = "google"
            db.add(user)
            db.commit()
            db.refresh(user)
        else:
            # Create new user
            new_user_data = UserCreate(
                username=username or email.split("@")[0],
                email=email,
                google_id=google_id,
                provider="google",
                image=image,
            )
            user = crud.create_user(db=db, user=new_user_data)

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={
            "sub": str(user.id),
            "username": user.username,
            "email": user.email,
            "image": user.image if user.image else "",
        },
        expires_delta=access_token_expires,
    )

    return RedirectResponse(
        url=f"http://localhost:5173/login?access_token={access_token}"
    )


@router.get("/login/github")
async def login_github(request: Request):
    redirect_uri = request.url_for("auth_github")
    return await _oauth_client.github.authorize_redirect(request, redirect_uri)


@router.get("/github/callback", name="auth_github")
async def auth_github(request: Request, db: Session = Depends(get_db)):
    try:
        token = await _oauth_client.github.authorize_access_token(request)
    except OAuthError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

    # Authlib's GitHub client does not have parse_id_token
    # Need to manually fetch user info
    resp = await _oauth_client.github.get("user", token=token)
    user_info = resp.json()

    github_id = str(user_info.get("id"))
    username = user_info.get("login")
    image = user_info.get("avatar_url")

    # Fetch emails from GitHub API
    resp_emails = await _oauth_client.github.get("user/emails", token=token)
    emails = resp_emails.json()

    primary_email = next(
        (e["email"] for e in emails if e["primary"] and e["verified"]), None
    )

    if not primary_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="GitHub did not provide a primary verified email.",
        )

    user = crud.get_user_by_oauth_id(db, "github", github_id)
    if not user:
        user = crud.get_user_by_email(db, primary_email)
        if user:
            # Link existing user with GitHub ID
            user.github_id = github_id
            user.provider = "github"
            db.add(user)
            db.commit()
            db.refresh(user)
        else:
            # Create new user
            new_user_data = UserCreate(
                username=username or primary_email.split("@")[0],
                email=primary_email,
                github_id=github_id,
                provider="github",
                image=image,
            )
            user = crud.create_user(db=db, user=new_user_data)

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={
            "sub": str(user.id),
            "username": user.username,
            "email": user.email,
            "image": user.image if user.image else "",
        },
        expires_delta=access_token_expires,
    )

    return RedirectResponse(
        url=f"http://localhost:5173/login?access_token={access_token}"
    )
