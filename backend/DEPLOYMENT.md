# Backend Deployment Guide

This backend is containerized and ready for deployment.

## Prerequisites

- A PostgreSQL database accessible from the deployment environment.
- Environment variables configured (see `.env.example`).

## Configuration

Set the following environment variables in your deployment platform:

- `DATABASE_URL`: Connection string to your PostgreSQL database.
- `SECRET_KEY`: A long, random string for security.
- `FRONTEND_URL`: The URL of your deployed frontend (e.g., `https://my-calendar-app.com`).
- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`: For Google OAuth.
- `GITHUB_CLIENT_ID` & `GITHUB_CLIENT_SECRET`: For GitHub OAuth.

## Deployment Options

### Docker (Recommended)

1.  **Build the image**:
    ```bash
    docker build -t personal-calendar-api .
    ```

2.  **Run the container**:
    ```bash
    docker run -d -p 8000:8000 --env-file .env personal-calendar-api
    ```

### Platform-Specific Notes

-   **Render/Railway/Heroku**:
    -   Connect your GitHub repository.
    -   Set the Root Directory to `backend` (if deploying from monorepo).
    -   The `Dockerfile` will be automatically detected.
    -   Add the Environment Variables in the platform's dashboard.

### Database Migrations

Currently, the application attempts to create tables on startup if they don't exist (`create_db_and_tables`). For production with evolving schemas, consider setting up **Alembic** migrations.
