# News Feed

Full-stack news feed application with a React frontend and a NestJS backend. The project supports authenticated news management, infinite scrolling, real-time updates over WebSockets, and background report generation with BullMQ.

## Stack

- Frontend: React 19, React Router 7, React Query, Redux Toolkit, PrimeReact, Tailwind CSS
- Backend: NestJS, TypeORM, PostgreSQL, Socket.IO, BullMQ, Redis
- Infrastructure: Docker Compose

## Main Features

- Infinite scroll news feed with server-side pagination
- News CRUD with optional image upload
- JWT-based authentication
- User profile loading and updating
- Real-time events over WebSockets
- Background CSV report generation with BullMQ

## Architecture Overview

The repository is split into two applications:

- [frontend](./frontend): client application responsible for rendering the news feed, authentication UI, dialogs, and socket subscriptions
- [backend](./backend): API, authentication, persistence, uploads, Socket.IO gateway, and BullMQ worker

Supporting services:

- PostgreSQL stores users and news
- Redis is used by BullMQ for background jobs
- Docker Compose orchestrates the local environment

## How It Works

### News Feed and Infinite Scroll

- The frontend loads paginated news from `GET /api/news`
- React Query handles paged fetching
- PrimeReact `VirtualScroller` triggers lazy loading when the user reaches the end of the loaded list
- Sorting is supported in ascending and descending order by creation date

### News CRUD

- Authenticated users can create, edit, and delete news
- News is submitted as `multipart/form-data`
- Images are stored by the backend upload service and exposed from `/uploads`

### Authentication

- Login is handled by `POST /api/auth/login`
- The backend returns a JWT access token
- The frontend stores the token in `localStorage`
- HTTP requests use the token in the `Authorization: Bearer <token>` header
- WebSocket connections also use the same token during Socket.IO handshake

### WebSockets

- Socket namespace: `/ws/connection`
- Only authenticated users can connect
- Each user joins a dedicated room in the format `user:<id>`
- The backend can emit:
  - personal events to a single user room
  - broadcast events to all connected clients
- The frontend listens for events such as `news-added`

### Report Generation with BullMQ

- The client triggers report generation with `POST /api/news/download`
- The backend enqueues a job into the `report-generation` queue
- BullMQ processor handles the job in the background
- The report is generated from news data and stored through the upload service
- Progress or completion can be communicated back to the user through WebSocket events

## Project Structure

```text
news-feed/
├── backend/        # NestJS API, Socket.IO, BullMQ, PostgreSQL integration
├── frontend/       # React application
├── docker-compose.yml
├── .env.example
└── README.md
```

## Environment Variables

Copy `.env.example` to `.env` and configure it before running the project.

Required backend variables:

```env
PORT=3000

POSTGRES_HOST=postgres
POSTGRES_PORT=5432
POSTGRES_USER=your_user
POSTGRES_PASSWORD=your_password
POSTGRES_DB=news_feed

AUTH_SECRET=your_jwt_secret
```

Recommended frontend variables in the same root `.env` file:

```env
VITE_BACKEND_HOST=http://localhost:3000/api
VITE_BACKEND_WS=http://localhost:3000/ws/connection
```

## Run with Docker Compose

### 1. Start services

```bash
docker compose up -d --build
```

This starts:

- `postgres`
- `redis`
- `backend`
- `frontend`

### 2. Run database migrations

```bash
docker compose exec backend npm run migration:run
```

### 3. Seed demo data

```bash
docker compose exec backend npm run db:seed
```

### 4. Open the app

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3000/api`

## Demo Credentials

The seed creates a demo user:

- Email: `test@test.ru`
- Password: `123`

## Local Development Without Docker

If you prefer running services manually:

1. Start PostgreSQL
2. Start Redis
3. Configure `.env`
4. Install backend dependencies and run the API
5. Install frontend dependencies and run the client

Backend:

```bash
cd backend
npm install
npm run migration:run
npm run db:seed
npm run start:dev
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

## Important API Endpoints

Public:

- `POST /api/auth/login`
- `GET /api/news`

Authenticated:

- `GET /api/auth/me`
- `GET /api/users/me`
- `PATCH /api/users/me`
- `POST /api/news`
- `PATCH /api/news/:id`
- `DELETE /api/news/:id`
- `POST /api/news/download`

## Backend Modules

- `AuthModule`: login and JWT validation
- `UserModule`: profile data
- `NewsModule`: news CRUD and report generation workflow
- `UploadModule`: file storage for avatars, images, and reports
- `RealtimeModule`: Socket.IO gateway for real-time events

## Notes

- The backend uses a global `/api` prefix
- Static uploaded files are served from `/uploads`
- BullMQ requires Redis to be available
- WebSocket connections require a valid JWT token

## Additional Docs

- [Backend README](./backend/README.md)
- [Frontend README](./frontend/README.md)
