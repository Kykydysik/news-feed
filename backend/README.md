# Backend

NestJS backend for the News Feed application. It provides REST APIs, JWT authentication, file uploads, WebSocket events, and background job processing with BullMQ.

## Tech Stack

- NestJS
- TypeORM
- PostgreSQL
- Socket.IO
- BullMQ
- Redis

## Responsibilities

- Authenticate users with JWT
- Serve public and protected REST endpoints
- Store news and users in PostgreSQL
- Handle avatar and news image uploads
- Generate CSV reports in the background
- Emit WebSocket events to a single user or all connected clients

## Module Overview

### `AuthModule`

- `POST /api/auth/login`
- Validates email and password
- Returns `access_token`
- Global auth guard protects all routes except those marked as public

### `UserModule`

- `GET /api/users/me`
- `PATCH /api/users/me`
- Loads and updates the current user profile

### `NewsModule`

- `GET /api/news`
- `POST /api/news`
- `PATCH /api/news/:id`
- `DELETE /api/news/:id`
- `POST /api/news/download`

This module also:

- registers the BullMQ queue for report generation
- contains the queue processor
- uses the realtime gateway to emit socket events

### `RealtimeModule`

- Registers `WsEventsGateway`
- Accepts only authenticated Socket.IO connections
- Places each connected user into a room named `user:<id>`
- Supports both broadcast and personal event delivery

### `UploadModule`

- Saves uploaded images and generated files
- Exposes files through the static `/uploads` path

## Request Flow

### Authentication

1. Client sends credentials to `POST /api/auth/login`
2. Backend verifies the password
3. Backend returns a signed JWT
4. Client sends the JWT in HTTP headers and Socket.IO handshake

### Create News

1. Authenticated client submits `multipart/form-data`
2. Backend stores the optional image
3. News is saved in PostgreSQL
4. Backend emits a WebSocket event such as `news-added`

### Download Report

1. Client calls `POST /api/news/download`
2. Backend adds a BullMQ job to the `report-generation` queue
3. `ReportRunsProcessor` handles the job
4. Backend collects all news rows and converts them to CSV
5. Generated file is stored through the upload service
6. Progress can be sent back over WebSockets

## Environment

The backend reads configuration from the root `.env` file.

Example:

```env
PORT=3000
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
POSTGRES_USER=your_user
POSTGRES_PASSWORD=your_password
POSTGRES_DB=news_feed
AUTH_SECRET=your_jwt_secret
```

For Docker Compose, Redis is expected to be available under host `redis` on port `6379`.

## Running the Backend

### With Docker Compose

From the repository root:

```bash
docker compose up -d --build
docker compose exec backend npm run migration:run
docker compose exec backend npm run db:seed
```

### Locally

```bash
cd backend
npm install
npm run migration:run
npm run db:seed
npm run start:dev
```

## Available Scripts

```bash
npm run build
npm run start
npm run start:dev
npm run start:prod
npm run migration:run
npm run db:seed
npm run test
npm run test:e2e
```

## WebSocket Notes

- Namespace: `/ws/connection`
- Auth method: JWT in `auth.token` during Socket.IO handshake
- User room format: `user:<id>`

Typical backend helpers:

- send to one user: `server.to(userRoom).emit(...)`
- send to all users: `server.emit(...)`

## Data Storage

- PostgreSQL stores users and news entities
- Redis stores BullMQ queue data
- Uploaded assets and generated reports are stored in `backend/uploads`

## API Prefix

All REST endpoints are served under:

```text
/api
```
