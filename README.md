# AI Todo Task — Frontend (Vite + React + TypeScript)

## Overview
Simple UI to manage **tasks** and to **simplify text with AI**.
- Lists tasks, creates/edits/deletes via REST.
- Live updates via **WebSocket (STOMP + SockJS)** on `/topic/tasks`.
- AI button “Förenkla text (AI)” calls backend `/api/ai/simplify`.

## Tech
- Vite, React, TypeScript.
- STOMP client (`@stomp/stompjs`) + SockJS.
- Uses environment vars for backend base URLs.

## Technical motivation
I used Spring Boot for the backend (logic + database) and React (Vite) for the frontend UI.
Spring Boot serves data through REST and WebSocket, while React handles the browser interface dynamically.
Node.js is only a local tool that Vite uses to run and bundle the frontend — it’s not the backend.

**This structure follows the course requirements:**
- Java backend
- React + TypeScript frontend
- AI integration
- WebSocket real-time updates

## Prerequisites
- Node.js 18+ and npm.
- Backend (Spring Boot) running on port 8080.

## Setup
Create a `.env` **in the frontend project root**:
```bash
VITE_API_BASE=http://localhost:8080
VITE_WS_BASE=http://localhost:8080
```
- `VITE_API_BASE` → backend HTTP (REST), default `http://localhost:8080`.
- `VITE_WS_BASE`  → backend WS base (for SockJS), same host by default.

## Install & run:
```bash
cd AI-Todo-Task-Frontend
npm install
npm run dev
```
Vite will print the local URL (commonly `http://localhost:5173`).

## How it works
- `src/api.ts`: wrapper for REST calls (`/api/tasks`, `/api/ai/simplify`).
- `src/ws.ts`: connects STOMP over SockJS to `{
    "endpoint": "/ws",
    "topic": "/topic/tasks"
}`.
- `src/components/TaskForm.tsx`: form with basic validation (title required, min length).
- `src/components/TaskList.tsx`: renders list, edit/delete, triggers AI simplify for description.
- `src/ai/AiSimplifyButton.tsx`: calls `api.simplifyText` and shows loading/error.

## Project Structure
```
AI-Todo-Task-rontend/
  src/
    App.tsx
    api.ts              # REST client
    ws.ts               # STOMP/SockJS client
    components/
      TaskForm.tsx
      TaskList.tsx
    ai/
      AiSimplifyButton.tsx
  index.html
  package.json
  vite.config.*
```

## Dev Tips
- Ensure backend is running at `8080` or adjust `.env`.
- Open DevTools console → check Connected to /ws message.
- Open two tabs → real-time updates appear immediately.

## Common issues
- CORS error: add allowed origin http://localhost:5173 in backend WebConfig.java.
- SockJS connection error: check that backend /ws endpoint is active.
- Mixed content (https/http): ensure both backend and frontend use the same protocol.

## Build
```bash
npm run build
npm run preview
```

## References
**Official sources and documentation used:**
- https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html
- https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes-func.html
- https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes-oop.html
