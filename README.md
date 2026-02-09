# Personal Calendar

A full-stack personal calendar application built with FastAPI and React.

## Features

- **User Authentication**: Secure login and signup with JWT-based authentication.
- **Dashboard**: Central hub for managing your schedule.
- **Day View**: Detailed view of your day with event management.
- **Settings**: User profile and application settings.
- **Responsive Design**: Built with Tailwind CSS for a seamless experience on all devices.

## Tech Stack

### Backend
- **Framework**: FastAPI
- **Database**: PostgreSQL
- **ORM**: SQLAlchemy
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Bcrypt for password hashing

### Frontend
- **Framework**: React
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Routing**: React Router

## Prerequisites

- Docker
- Docker Compose

## Installation & Setup

1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    cd personal-calendar
    ```

2.  **Start the application**
    ```bash
    docker compose up --build
    ```

## Usage

Once the application is running:

- **Frontend**: Access the app at `http://localhost:5173`
- **Backend API**: Access the API at `http://localhost:8000`
- **Database**: Access the PostgreSQL database at `http://localhost:5432`

## Development

### Running Backend Separately

If you want to run the backend locally without Docker:

1.  **Install dependencies**
    ```bash
    cd backend
    pip install -r requirements.txt
    ```

2.  **Run the server**
    ```bash
    uvicorn main:app --reload
    ```

### Running Frontend Separately

If you want to run the frontend locally without Docker:

1.  **Install dependencies**
    ```bash
    cd frontend
    npm install
    ```

2.  **Run the development server**
    ```bash
    npm run dev
    ```