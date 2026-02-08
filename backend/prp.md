# Authentication with FastAPI Plan

## Objective
Implement an authentication system for a FastAPI application with user registration, login, and JWT-based token creation. The user model will include username, email, password, and an optional image.

## Tools/Libraries
- `FastAPI`: Web framework.
- `Pydantic`: Data validation and settings management.
- `python-jose[cryptography]`: For JWT handling.
- `passlib[bcrypt]`: For password hashing.

## File Structure
- `main.py`: Existing FastAPI application.
- `schemas.py`: To define Pydantic models for user input and output.
- `auth.py`: To handle password hashing, JWT encoding/decoding, and authentication logic.
- `database.py` (or similar): For user storage (initially, an in-memory dictionary for simplicity; can be extended to a proper database later).

## Detailed Plan

### 1. Initialize Project and Install Dependencies
- Ensure `FastAPI`, `uvicorn`, `python-jose[cryptography]`, and `passlib[bcrypt]` are installed.

### 2. `schemas.py` - Define Pydantic Models
- `UserCreate`: For user registration input (username, email, password).
- `UserInDB`: Represents a user stored in the "database" (username, email, hashed_password, image_url).
- `UserResponse`: For user output (username, email, image_url).
- `Token`: For JWT response (access_token, token_type).
- `TokenData`: For data extracted from JWT (username).

### 3. `auth.py` - Authentication Logic
- **Password Hashing:**
    - `pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")`
    - `verify_password(plain_password, hashed_password)`
    - `get_password_hash(password)`
- **JWT Handling:**
    - `SECRET_KEY`: Generate a strong secret key.
    - `ALGORITHM = "HS256"`
    - `ACCESS_TOKEN_EXPIRE_MINUTES`: Define token expiration.
    - `create_access_token(data: dict, expires_delta: Optional[timedelta] = None)`: Function to create JWT.
    - `decode_access_token(token: str)`: Function to decode and validate JWT.
- **OAuth2PasswordBearer:**
    - `oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")` (or "login")
    - `get_current_user(token: str = Depends(oauth2_scheme))`: Dependency to get the current authenticated user.

### 4. `database.py` (or in-memory mock) - User Storage
- `fake_users_db = {}` (dictionary to store users).
- `get_user(username: str)`: Function to retrieve user by username.
- `add_user(user: UserInDB)`: Function to add a user.

### 5. `main.py` - FastAPI Application
- **Import necessary modules** from `schemas.py`, `auth.py`, `database.py`.
- **Register Endpoint (`/register`):**
    - `POST` request.
    - Takes `UserCreate` as input.
    - Hashes password.
    - Stores user in `fake_users_db`.
    - Returns `UserResponse`.
- **Login Endpoint (`/login`):**
    - `POST` request.
    - Takes `OAuth2PasswordRequestForm` (from `fastapi.security`).
    - Verifies username and password.
    - Creates and returns a JWT token (`Token`).
- **Protected Endpoint (`/users/me`):**
    - `GET` request.
    - Requires `Depends(get_current_user)`.
    - Returns details of the current authenticated user (`UserResponse`).

## Testing (Conceptual)
1.  **Register a user:** `POST` to `/register` with username, email, password.
2.  **Login:** `POST` to `/login` with username and password, get JWT.
3.  **Access Protected Endpoint:** `GET` to `/users/me` with `Authorization: Bearer <JWT>` header.

## Next Steps
Proceed with implementation based on this plan.
