# Frontend

React frontend for the News Feed application. It renders the news feed, handles authentication UI, opens create/edit dialogs, listens to WebSocket events, and triggers background report generation.

## Tech Stack

- React 19
- React Router 7
- React Query
- Redux Toolkit
- PrimeReact
- Tailwind CSS
- Socket.IO Client

## Responsibilities

- Display paginated news
- Support infinite scrolling
- Allow authenticated users to create, edit, and delete news
- Store and reuse JWT tokens
- Connect to the backend WebSocket gateway
- Trigger report generation requests

## Application Structure

```text
frontend/app/
├── modules/news/       # News pages, hooks, API calls, dialogs
├── modules/profile/    # Authentication and profile logic
├── shared/api/         # HTTP client and Socket.IO wrapper
├── shared/layout/      # Layout components
└── store/              # Redux store
```

## Feature Overview

### Infinite Scroll News Feed

- The main page renders the news list
- Data is loaded with React Query `useInfiniteQuery`
- PrimeReact `VirtualScroller` requests the next page when the user scrolls near the end
- The frontend passes `offset` and `sort` to the backend

### News CRUD

- Authenticated users can open a dialog to create or edit news
- News is sent as `FormData`
- Image upload is supported
- Deletion is available from the same flow

### Authentication

- Login uses `POST /api/auth/login`
- JWT is saved in `localStorage`
- The shared Axios client automatically sends `Authorization: Bearer <token>`
- After login, the profile is loaded from the backend

### WebSocket Events

- The app connects to the backend via Socket.IO
- The JWT token is sent in the Socket.IO auth payload
- The frontend subscribes to events like `news-added`
- New events can be merged into the feed without a full page reload

### Report Generation

- The UI can request report generation through `POST /api/news/download`
- The backend handles the heavy work in BullMQ
- Progress and completion can be delivered over WebSockets

## Environment Variables

The frontend reads variables from the repository root `.env` file.

Example:

```env
VITE_BACKEND_HOST=http://localhost:3000/api
VITE_BACKEND_WS=http://localhost:3000/ws/connection
```

## Running the Frontend

### With Docker Compose

From the repository root:

```bash
docker compose up -d --build
```

The frontend will be available at:

```text
http://localhost:5173
```

### Locally

```bash
cd frontend
npm install
npm run dev
```

## Available Scripts

```bash
npm run dev
npm run build
npm run start
npm run typecheck
```

## Integration Notes

- REST API base URL comes from `VITE_BACKEND_HOST`
- WebSocket URL comes from `VITE_BACKEND_WS`
- The frontend expects the backend REST API to be served under `/api`
- The frontend expects the Socket.IO namespace `/ws/connection`

## User Journey

1. Open the news feed
2. Scroll to load more items
3. Sign in to unlock create, edit, delete, and report actions
4. Submit changes through dialogs
5. Receive live updates through WebSockets
